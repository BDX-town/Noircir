import xss from 'xss';

const allowed = ["class"];

// @ts-expect-error no types
const whiteList = Object.keys(xss.whiteList).reduce((acc, key) => {
    // @ts-expect-error no types
    const value = [...xss.whiteList[key], ...allowed];
    return {
        ...acc,
        [key]: value,
    }
}, {});

const options = {
    whiteList: {
        ...whiteList,
        iframe: ["src", "style", "width", "height", "frameBorder", "border"],
        main: allowed,
        svg: allowed,
        time: allowed,
    }
}

function sanitize(str: string) {
    return xss(str, options);
}

export default sanitize;