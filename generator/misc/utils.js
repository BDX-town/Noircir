const xss = require('xss');
const allowed = ["class"];

function escapeForHtmlAttr(str) {
  return str.replace(/'/g, '&rsquo;');
}

const whiteList = Object.keys(xss.whiteList).reduce((acc, key) => {
    const value = [...xss.whiteList[key], ...allowed];
    return {
        ...acc,
        [key]: value,
    };
}, {});

const options = {
    whiteList: {
        ...whiteList,
        iframe: ["src", "style", "width", "height", "frameBorder", "border"],
        main: allowed,
        svg: allowed,
        time: allowed,
    },
    onTag: (tag, html, options) => {
        if (options.isClosing == false && html.endsWith('/>')) {
            return `${html}</${tag}>`;
        }
        return undefined;
    }
};

function sanitize(str) {
    return xss(str, options);
}

module.exports = {
    sanitize,
    escapeForHtmlAttr
};
