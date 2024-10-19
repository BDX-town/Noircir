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
    },
    onTag: (tag: string, html: string, options: any) => {
        // some tags are self closing, we do not want them to stay that way as they can trap content in them (iframes for instance)
        if(options.isClosing == false && html.endsWith('/>')) {
            return `${html}</${tag}>`
        }
        return undefined;
    }
}

function sanitize(str: string) {
    return xss(str, options);
}

export default sanitize;