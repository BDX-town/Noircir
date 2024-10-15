import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
interface Translator extends Function {
  setLocale: (lang: string) => void;
  getLocale: () => string;
  registerTranslations: (lang: string, keys: object) => void;
}

interface ITranslationContext {
  // counterpart or meteor i18n
  __: Translator;
  // ISO 639-1 language code
  lang: string;
  // Import keys for multiple languages at once
  importTranslations: (langMap: { [lang: string]: object }) => void;
  // set language
  setLang: (lang: string) => void;
}

// Transform keys in format of string into real json object
// keys are dot-string to compatibility issues with weblate
function correctJSON(keys) {
  const result = {};
  Object.keys(keys).forEach((key) => {
    const parts: Array<string> = key.split('.');
    let current = result;
    const last = parts.pop() as string;
    parts.forEach((part) => {
      if (!current[part]) current[part] = {};
      current = current[part];
    });
    current[last] = keys[key];
  });
  return result;
}

/**
 * Compatibility layer meteor:i18n universe -> counterpart
 * Add plural management
 * @param {*} key
 * @param {*} params
 * @param {*} param2
 * @returns
 */
function interpolationAdapter(key, params = {}, { count = undefined } = {}) {
  // plural management
  let translation = this(count && count > 1 ? `${key}_plural` : key, params);
  // unifying interpolation system between counterpart and meteor i18n
  Object.keys(params).forEach((item) => {
    const reg = new RegExp(`%\\(${item}\\)s`, 'g');
    translation = translation.replace(reg, params[item]);
  });
  return translation;
}

const context: React.Context<ITranslationContext> = React.createContext({
  __: {},
  lang: 'fr-FR',
} as ITranslationContext);

/**
 * Declare a translation context to manage lang changes and trigger re-render
 * @param param0
 * @returns
 */
export function TranslationContext({
  __,
  children,
  defaultLang,
}: {
  __: Translator;
  children: React.ReactElement | React.ReactElement[];
  defaultLang: string;
}) {
  const [lang, setLang] = React.useState(defaultLang);

  const internal__ = React.useMemo(() => {
    // plug in the compatibility layer between meteor i18n and counterpart
    const int = interpolationAdapter.bind(__);
    // since we use a new function we have to rebind all the pre-existing calls
    // to the interpolationAdapter
    // we want to iterate the prototype chain
    // eslint-disable-next-line no-restricted-syntax
    for (const key in __) {
      // eslint-disable-next-line no-prototype-builtins
      if (!int.hasOwnProperty(key)) {
        int[key] = __[key];
      }
    }

    return int;
  }, [__]);

  // allow to use { "fr-FR": keys, "en-US": keys} etc..
  const importTranslations = React.useCallback(
    (langMap: { [lang: string]: object }) => {
      Object.keys(langMap).forEach((l) => {
        internal__.registerTranslations(l, correctJSON(langMap[l]));
      });
    },
    [internal__],
  );

  const value: ITranslationContext = React.useMemo(
    () => ({
      __: internal__,
      lang,
      importTranslations,
      setLang,
    }),
    [importTranslations, internal__, lang],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

/**
 * Import keys and returns function to translate keys and manage lang changes
 * @param componentName
 * @param keys
 * @returns
 */
export function useTranslations(
  componentName: string | undefined = undefined,
  keys: { [lang: string]: object } | undefined = undefined,
) {
  const {
    __, lang, importTranslations, setLang,
  } = React.useContext(context);

  const disabled = React.useMemo(
    () => !__ || !lang || !importTranslations || !setLang,
    [__, lang, importTranslations, setLang],
  );

  const scoped__ = React.useMemo(() => {
    if (!__ || !lang || !importTranslations || !setLang) {
      return () => null;
    }
    __.setLocale(lang);
    if (keys) {
      importTranslations(keys);
    }
    return (key, ...args) => {
      if (componentName) return __(`${componentName}.${key}`, ...args);
      return __(key, ...args);
    };
  }, [__, componentName, importTranslations, keys, lang, setLang]);

  const T = React.useCallback(
    ({ children, ...rest }: { children: React.ReactNode, [k: string]: any }) => (
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: scoped__(children, { ...rest, children: null }),
        }}
      />
    ),
    [scoped__],
  );

  return React.useMemo(
    () => ({
      setLang,
      lang,
      __: scoped__,
      T,
      disabled,
    }),
    [T, scoped__, setLang, disabled],
  );
}
