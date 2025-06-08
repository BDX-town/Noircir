const ReactDOM = require('react-dom/server');
const React = require('react');
const { HTMLIndex } = require('template');

class Style {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        }
    }

    render(props) {
        console.log(ReactDOM.renderToStaticMarkup(React.createElement(HTMLIndex, {...props, ...(props.blog ? props.blog : {})})));
        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTMLIndex, {...props, ...(props.blog ? props.blog : {})}))}`;
    }
}

module.exports = Style;