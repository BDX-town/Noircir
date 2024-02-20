const ReactDOM = require('react-dom/server');
const React = require('react');
const { HTML } = require('template');

class Style {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            style: "/style.css",
        }
    }

    render(props) {
        return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(React.createElement(HTML, {...props, ...(props.blog ? props.blog : {})}))}`;
    }
}

module.exports = Style;