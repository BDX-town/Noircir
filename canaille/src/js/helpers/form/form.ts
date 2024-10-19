import React from 'react';

import { useTranslations } from '../useTranslations';

import fr from './form.fr-FR.i18n.json';
import en from './form.en-US.i18n.json';
import de from './form.de-DE.i18n.json';
import gb from './form.en-GB.i18n.json';
import es from './form.es-ES.i18n.json';
import it from './form.it-IT.i18n.json';

const locales = {
  'fr-FR': fr,
  'en-US': en,
  'de-DE': de,
  'en-GB': gb,
  'es-ES': es,
  'it-IT': it,
};

export type HTMLEditableElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/**
 * Hook,used to allow to track for reset event on input parent form
 * Usefull to be able to make reset effective on form component with an internalValue state
 * (Like Inputs for example)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormValue(
  ref: React.MutableRefObject<HTMLEditableElement>,
  _initialValue: any,
) {
  const initialValue = React.useRef(_initialValue);
  const [internalValue, setInternalValue] = React.useState(
    initialValue.current,
  );

  const onReset = React.useCallback(
    () => setInternalValue(initialValue.current),
    [initialValue],
  );

  React.useEffect(() => {
    if (!ref.current) return undefined;
    const { current } = ref;
    if (!current.form) return undefined;
    const callback = () => {
      current.form.onResets.forEach((c) => c());
    };
    if (!current.form.onResets) {
      current.form.onResets = [];
      current.form.addEventListener('reset', callback);
    }
    current.form.onResets = [...current.form.onResets, onReset];

    return () => {
      if (!current.form) return;
      current.form.onResets = current.form.onResets.filter(
        (o) => o !== onReset,
      );
      if (current.form.onResets.length === 0) {
        current.form.removeEventListener('reset', callback);
        current.form.onResets = null;
      }
    };
  }, [onReset, ref]);

  return React.useMemo(
    () => [internalValue, setInternalValue],
    [internalValue, setInternalValue],
  );
}

/**
 * Enable validation translation according application-level locale, instead of browser-level locale
 */
export function useValidation({
  root,
  validateOnChange = false,
  checkValidity = undefined,
  onInvalid = undefined,
}: {
  root: React.RefObject<HTMLEditableElement | HTMLFieldSetElement>;
  validateOnChange: boolean;
  checkValidity: ((i: unknown) => string | undefined) | undefined;
  onInvalid:
  | React.FormEventHandler<HTMLEditableElement | HTMLFieldSetElement>
  | undefined;
}) {
  const { __, disabled } = useTranslations('useValidation', locales);
  const [error, setError] = React.useState<string | undefined>(undefined);
  // we use an object to be able to retrieve by ref and not only value (timers are stored as number)
  const dirtyTimeout = React.useRef({ timer: null });
  const [dirty, setDirty] = React.useState<boolean>(false);

  React.useEffect(() => {
    const timeout = dirtyTimeout.current;
    return () => {
      if (!timeout.timer) return;
      clearTimeout(timeout.timer);
      timeout.timer = null;
    };
  }, []);

  const setInitialValue = React.useCallback(() => {
    if (!(root.current instanceof HTMLSelectElement)) return;
    root.current.setAttribute(
      'data-initial-value',
      JSON.stringify(
        Array.from(root.current.selectedOptions).map((o) => o.value),
      ),
    );
  }, []);

  /**
   * Update data-dirty attribute to help identify changed field
   */
  const updateDirty = React.useCallback((node: HTMLEditableElement) => {
    let wDirty = false;
    if (
      node instanceof HTMLInputElement
      && (node.type === 'checkbox' || node.type === 'radio')
    ) {
      // radio and checkbox
      wDirty = node.defaultChecked !== node.checked;
    } else if (node instanceof HTMLSelectElement) {
      // select element
      const initialValue = JSON.parse(node.getAttribute('data-initial-value'));
      wDirty = node.selectedOptions.length !== initialValue.length
        || !!Array.from(node.selectedOptions).find(
          (o) => initialValue.indexOf(o.value) === -1,
        );
    } else {
      // simple text fields and basic inputs
      wDirty = node.defaultValue !== node.value;
    }
    (
      Array.from(
        root.current.querySelectorAll('input, textarea, select'),
      ) as Array<HTMLEditableElement>
    ).forEach((i) => i.setAttribute('data-dirty', ''));
    node.setAttribute('data-dirty', wDirty ? 'true' : 'false');
    // making react re-render there is preventing
    //  controlled component to work properly, temporary workaround
    const timeout = dirtyTimeout.current;
    if (timeout.timer) {
      clearTimeout(timeout.timer);
      timeout.timer = null;
    }
    timeout.timer = setTimeout(() => {
      timeout.timer = null;
      setDirty(wDirty);
    }, 200);
  }, []);

  /**
   * Translate native validation error message so Boto locale is used instead of browser's one
   */
  const translateValidity = React.useCallback(
    (ev) => {
      // Error messages based on https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
      const type = __(`type.${ev.target.type || 'text'}`);

      if (!type) {
        // eslint-disable-next-line no-console
        console.warn(
          `Input type ${type} is unknown. Please add a valid translation for ${type} in form.xx-XX.json in boto's code base.`,
        );
      }

      const e = Object.keys(fr.useValidation.error).find(
        (k) => ev.target.validity[k],
      );

      // if the field is invalid because of a custom check or that we dont handle the error for now
      if (!e) return;

      const attrs = {
        max: null,
        min: null,
        maxLength: null,
        minLength: null,
      };
      Object.keys(attrs).forEach((k) => {
        attrs[k] = ev.target.getAttribute(k);
      });

      const warn = !disabled
        ? __(`error.${e}`, { ...attrs, type })
        : en.useValidation.error[e];

      ev.target.setCustomValidity(warn);
    },
    [__, disabled],
  );

  /**
   * Perform optional custom validity check and update error state
   */
  const updateValidity = React.useCallback(
    (node: HTMLEditableElement | HTMLFieldSetElement, lifeCycle = false) => {
      // we reset all errors for given input / fieldset
      node.setCustomValidity('');
      const children = Array.from(
        root.current.querySelectorAll('input, textarea, select'),
      ) as Array<HTMLEditableElement>;
      children.forEach((i) => i.setCustomValidity(''));
      // we update the error message if custom validation fails
      // this message is not shown until form or input call checkValidity
      if (checkValidity) {
        if (node instanceof HTMLFieldSetElement) {
          const errors = children.map((c) => checkValidity(c.value));
          const index = errors.findIndex((v) => !!v);
          if (index !== -1) {
            children[index].setCustomValidity(errors[index]);
          }
        } else {
          const e = checkValidity((node as HTMLEditableElement).value);
          if (e) {
            node.setCustomValidity(e);
          }
        }
      }

      let hasError = false;
      // Handling on change validation
      if (validateOnChange && !lifeCycle) {
        if (node instanceof HTMLFieldSetElement) {
          hasError = !!children.find((c) => !c.checkValidity());
        } else {
          hasError = !node.checkValidity();
        }
      }
      return hasError;
    },
    [checkValidity, root, validateOnChange],
  );

  const onInput: React.FormEventHandler<
  HTMLEditableElement | HTMLFieldSetElement
  > = React.useCallback(
    (e) => {
      // Event on a fieldset, the target element is the EditableElement
      updateDirty(e.target as HTMLEditableElement);
      if (!updateValidity(e.target as HTMLEditableElement)) {
        setError(undefined);
      }
    },
    [updateValidity, updateDirty],
  );

  const onInvalidInternal: React.FormEventHandler<
  HTMLEditableElement | HTMLFieldSetElement
  > = React.useCallback(
    (e) => {
      translateValidity(e);
      // Event on a fieldset, the target element is the EditableElement
      setError((e.target as HTMLEditableElement).validationMessage);
      if (onInvalid) onInvalid(e);
    },
    [onInvalid, translateValidity],
  );

  React.useEffect(() => {
    setInitialValue();
    updateValidity(root.current, true);
  }, [setInitialValue, updateValidity]);

  return {
    error,
    setError,
    dirty,
    onInput,
    onInvalid: onInvalidInternal,
    setInitialValue,
    updateValidity,
    updateDirty,
  };
}
