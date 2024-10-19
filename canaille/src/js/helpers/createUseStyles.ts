import React from 'react';
import debounce from 'debounce';
import pack from '../../../package.json';

type Style = { [cls: string]: Style | React.CSSProperties | ((props: any) => Style | React.CSSProperties) | Style };

type CSSItem = {
  rule: string;
  properties: Array<string>;
  children?: Array<CSSItem>;
};

type Sheet = {
  insertRule: (r: string, index: number) => string;
  deleteRule: (rulename: string) => void;
  remove: () => void;
  reset: () => void;
  style: Array<string>;
};

type Keyframe = {
  prefix: string;
  name: string;
  originalName: string;
};

const BASE_CLASS = 'CANAILLE';

/**
 * Return a counter function used to generate rules prefixes
 * @returns
 */
function createGenerateId() {
  let counter = 0;
  return function generateId() {
    counter += 1;
    return counter;
  };
}

/**
 * Manage style insertion.
 * On serverside, we store all styles in a dict to be able to serve them in SSR
 * @param rules
 * @returns
 */
function createNode(rules = '', namespace = ''): Sheet {
  if (globalThis.window) {
    const styleNode = document.createElement('style') as HTMLStyleElement;
    styleNode.className = namespace;
    document.head.appendChild(styleNode);
    const styleSheet = styleNode.sheet;
    // jest does not handle Layers correctly so we directly insert to the stylesheet instead
    if (!globalThis.process?.env?.JEST_WORKER_ID) {
      styleSheet.insertRule(`@layer ${pack.layers.components} { ${rules} }`);
    }
    const staticNode = !globalThis.process?.env?.JEST_WORKER_ID
      ? (styleSheet.cssRules[0] as CSSLayerBlockRule)
      : styleSheet;

    const reset = () => {
      while (staticNode.cssRules.length > 0) {
        staticNode.deleteRule(0);
      }
    };

    const insertRule = (rule: string, index: number) => {
      staticNode.insertRule(rule, index);
      const r = staticNode.cssRules[index].cssText;
      return r;
    };

    const deleteRule = (rule: string) => {
      for (let i = 0; i < staticNode.cssRules.length; i += 1) {
        if (rule === staticNode.cssRules[i].cssText) {
          staticNode.deleteRule(i);
          return;
        }
      }
    };

    return {
      style: [],
      reset,
      deleteRule,
      insertRule,
      remove: styleNode.remove.bind(styleNode),
    };
  }
  const style = [`@layer ${pack.layers.components} { ${rules} }`];
  return {
    style,
    reset: () => {
      style.splice(0, style.length);
    },
    deleteRule: () => null,
    insertRule: (r) => {
      style.push(`@layer ${pack.layers.components} { ${r} }`);
      return r;
    },
    remove: () => null,
  };
}

/**
 * Define Style meta data
 * All informations related to css-in-js during render is stored here
 */
class StyleMetaData {
  /**
   * Declare layers and layer priorities
   */
  public layerSheet: Sheet;

  /**
   * Declare static css style (not declared in functions)
   */
  public staticSheet: Sheet;

  /**
   * Declare dynamic css style (declared in functions)
   */
  public dynamicSheet: Sheet;

  /**
   * Declare all keyframes
   */
  public keyframes: Array<Keyframe>;

  /**
   * Generate ids (reset that to allow sync between server and client during ssr)
   */
  public generateId: () => number;

  public namespace: string;

  constructor() {
    this.namespace = `BOTO-${new Date().getTime()}`;
    this.keyframes = [];
    this.layerSheet = createNode('', `${this.namespace}-layer`);
    this.staticSheet = createNode('', `${this.namespace}-static`);
    this.reset();
  }

  public reset = () => {
    this.generateId = createGenerateId();
    this.dynamicSheet?.remove();
    this.dynamicSheet = createNode('', `${this.namespace}-dynamic`);
  };

  public getServerSideStyle = () =>
    `${this.layerSheet.style.join('\n\n')}\n\n${this.staticSheet.style.join('\n\n')}\n\n${this.dynamicSheet.style.join(
      '\n\n'
    )}`;
}

export const StyleMeta = new StyleMetaData();

/**
 * Manage sheets priority
 * @param higherId
 */
// May be debounce for performance

function _updateLayersOrder(higherId: number) {
  // JEST doesnt handle layers correctly
  if (globalThis.process?.env?.JEST_WORKER_ID) return;
  StyleMeta.layerSheet.reset();
  let layers = new Array(higherId + 1).fill(0);
  layers = layers.reduce((acc, curr, index) => [...acc, `${BASE_CLASS}-${index}`], []);
  const rule = `@layer ${layers.join(', ')};`;
  StyleMeta.layerSheet.insertRule(rule, 0);
}

const updateLayersOrder = !globalThis.window ? _updateLayersOrder : debounce(_updateLayersOrder, 50);

class Scope {
  hash: string;

  mapping: { [x: string]: string };

  constructor() {
    this.hash = Math.random().toString(16).slice(2);
    this.mapping = {};
  }

  register(original, scoped) {
    this.mapping[original] = scoped;
  }
}

/**
 * Convert JS rule into valid css rule
 * Handle $keyframe name replacement
 * @param ruleName
 * @param ruleBody
 * @returns
 */
function parseRule(prefix: string, ruleName: string, ruleBody: string, scope: Scope) {
  const name = ruleName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .trim();
  let body = ruleBody;


  // handle scoped var usage
  if (typeof body === 'string') {
    const varMatch = body?.match(/var\((.+?)\)/);
    if (varMatch && scope.mapping[varMatch[1]]) {
      body = body.replace(varMatch[1], scope.mapping[varMatch[1]]);
    }
  }
  if (name === 'animation' || name === 'animation-name') {
    const match = body.match(/\$(\S+)/);
    const rootPrefix = prefix.match(/(\S+?-[0-9]+)-.+/);
    if (match) {
      // we first search in the current prefix, and then expand to the root prefix (Boto-xx-id-xx first and then Boto-xx)
      const keyframe =
        StyleMeta.keyframes.find((k) => k.originalName === match[1] && k.prefix === prefix) ||
        (rootPrefix && StyleMeta.keyframes.find((k) => k.originalName === match[1] && k.prefix === rootPrefix[1]));
      if (keyframe) {
        body = body.replace(match[0], keyframe.name);
      } else {
        console.warn(`createUseStyle: Unable to find declared keyframe ${match[1]} in stylesheet ${prefix}`);
        console.warn(StyleMeta.keyframes);
      }
    }
    // handle scope var declaration
  } else if (name.startsWith('---')) {
    const scoped = name.replace('---', `--${scope.hash}-`);
    scope.register(name, scoped);
    return `${scoped}: ${body};`;
  }
  return `${name}: ${body};`;
}

/**
 * Flatten an inheritance
 * @param css
 * @returns
 */
function flatCSS(css: CSSItem): Array<CSSItem> {
  return [
    { rule: css.rule, properties: css.properties },
    ...(css.children
      .map((c) => flatCSS({ ...c, rule: c.rule.replace(/&/g, css.rule) }))
      .flat(Infinity) as Array<CSSItem>),
  ];
}

/**
 * Convert JS style object into intermediate CSSItem structure
 * @param prefix
 * @param className
 * @param obj
 * @returns
 */
function convertObjectToCSSString(
  prefix: string,
  className: string,
  obj: React.CSSProperties,
  scope: Scope,
): CSSItem | null {
  if (!obj) return null;
  const { properties, children } = Object.keys(obj).reduce(
    (acc, curr) => {
      if (typeof obj[curr] === 'object') {
        const calculated = convertObjectToCSSString(prefix, curr, obj[curr], scope);
        if (!calculated) return acc;
        const parts = curr.split(',');
        return {
          ...acc,
          children: [...acc.children, ...parts.map((r) => ({ ...calculated, rule: r }))],
        };
      }
      return {
        ...acc,
        properties: [...acc.properties, parseRule(prefix, curr, obj[curr], scope)],
      };
    },
    {
      properties: [],
      children: [],
    }
  );

  return {
    rule: className,
    properties,
    children: children.flat(Infinity) as Array<CSSItem>,
  };
}

/**
 * Handle keyframe declaration
 * @param prefix
 * @param ruleName
 * @param style
 * @param props
 * @returns
 */
function createKeyFrames(prefix, ruleName, style, scope: Scope, props = []) {
  // extract keyframe name
  const originalName = ruleName.replace('@keyframes', '').trim();
  const name = `${prefix}-${originalName}`;
  const keyframe: Keyframe = {
    name,
    originalName,
    prefix,
  };
  StyleMeta.keyframes.push(keyframe);
  const css =
    typeof style === 'function'
      ? convertObjectToCSSString(prefix, name, (style as (...props: any) => React.CSSProperties)(...props), scope)
      : convertObjectToCSSString(prefix, name, style as React.CSSProperties, scope);
  if (!css)
    return {
      className: '',
      rules: [],
    };
  const frames = flatCSS(css);
  // first is keyframe declaration we can ignore
  frames.shift();
  const rule = `
    @keyframes ${name} {
      ${frames.map((f) => `${f.rule} { ${f.properties.join('\n')} }`).join('\n\n')}
    }
  `;
  return {
    // we dont want to issue any className for this
    className: '',
    rules: [rule],
  };
}

/**
 * Convert JS style declaration into valid css rules
 * @param prefix
 * @param ruleName
 * @param style
 * @param props
 * @returns
 */
function createCSSBlock(prefix: string, ruleName: string, style, scope: Scope,props = []) {
  if (ruleName.startsWith('@keyframes')) return createKeyFrames(prefix, ruleName, style, scope, props);
  const className = `${prefix}-${ruleName}`;
  const css =
    typeof style === 'function'
      ? convertObjectToCSSString(prefix, className, (style as (...props: any) => React.CSSProperties)(...props), scope)
      : convertObjectToCSSString(prefix, className, style as React.CSSProperties, scope);

  if (!css)
    return {
      className: '',
      rules: [],
    };

  const nakedRule = flatCSS(css).map((c) => `.${c.rule.trim()} {\n ${c.properties.join('\n')} \n}`);

  // we wrap rules inside a nested layer so we can ensure that higher prefix ID ensure higher priority
  const basePrefix = prefix.match(/[A-Z]+-[0-9]+/i)[0];
  const layeredRule = `
    @layer ${basePrefix} {
      ${nakedRule.join('\n\n')}
    }
  `;

  // Jest doesnt handle layer correctly
  const rules = globalThis.process?.env?.JEST_WORKER_ID ? nakedRule : [layeredRule];

  return {
    className,
    rules,
  };
}

// Select correct hook given the context
// if react 18 -> React.useInsertionEffect else useLayoutEffect. On the ServerSide, we directly run the func
const useLayoutEffect = globalThis.window ? React.useInsertionEffect || React.useLayoutEffect : (fn) => fn();

/**
 * Manage stylesheet created from object declarations
 * CSSLayerBlockRule at index 0 is always the static style
 * CSSLayerBlockRule at index 1 is always the dynamic style
 */
export function createUseStyles(style: Style) {
  // we use a counter there since we cant use an uniqueId (it's a hook)
  // SSR users will need to reset the counter before each page render
  const sheetId = StyleMeta.generateId();
  const scope = new Scope();

  

  // here we only apply "static" styles aka the ones that arent declared via func
  const staticClasseNames = Object.keys(style).reduce((acc, curr) => {
    if (typeof style[curr] === 'function') return acc;
    const { className, rules } = createCSSBlock(`${BASE_CLASS}-${sheetId}`, curr, style[curr], scope);
    rules.forEach((r) => StyleMeta.staticSheet.insertRule(r, 0));
    return {
      ...acc,
      [curr]: className,
    };
  }, {});
  // create static node

  updateLayersOrder(sheetId);

  return function useStyle(...props): { [key: string]: string } {
    // consistent id between server and browser
    const styleId = React.useId().replace(/:/g, '');
    const propsHash = JSON.stringify(props, (key, value) => {
      // we handle stringify some edgecases
      if (globalThis.HTMLElement && value instanceof HTMLElement)
        return value.className + value.id + value.parentElement?.className + value.parentElement?.id;
      return value;
    });

    // we dont want to retrigger at dom edit everytime, so we store intermediate results to be able to compare
    const { dynamicClassNames, dynamicRules } = React.useMemo(() => {
      const wDynamicRules = [];
      const wDynamicClassNames = Object.keys(style).reduce((acc, curr) => {
        if (typeof style[curr] !== 'function') return acc;
        const { className, rules } = createCSSBlock(`${BASE_CLASS}-${sheetId}-${styleId}`, curr, style[curr], scope, props);
        wDynamicRules.push(...rules);
        return {
          ...acc,
          [curr]: className,
        };
      }, {});

      return {
        dynamicClassNames: wDynamicClassNames,
        dynamicRules: wDynamicRules,
      };
    }, [propsHash]);

    // here we only apply "dynamic" styles aka the ones that are declared via func
    useLayoutEffect(() => {
      if (dynamicRules.length === 0) return undefined;
      const rules = dynamicRules.map((r) => StyleMeta.dynamicSheet.insertRule(r, 0));
      return () => {
        rules.forEach((r) => StyleMeta.dynamicSheet.deleteRule(r));
      };
    }, [JSON.stringify(dynamicRules)]);

    return React.useMemo(() => ({ ...staticClasseNames, ...dynamicClassNames }), [JSON.stringify(dynamicClassNames)]);
  };
}
