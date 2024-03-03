import xss from 'xss';

const options = {
    whiteList: {
        // @ts-expect-error no types
        ...xss.whiteList,
        main: [],
        svg: [],
        time: [],
    }
}

function sanitize(str: string) {
    return xss(str, options);
}

export default sanitize;