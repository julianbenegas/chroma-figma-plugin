import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';
import * as chroma from 'chroma-js';
console.log('up here');
const App = () => {
    console.log('here!!!!');
    const [data, setData] = React.useState({ colors: '', count: '5' });
    const handleChange = (event) => {
        setData(Object.assign({}, data, { [event.currentTarget.name]: event.currentTarget.value }));
    };
    const onCreate = () => {
        const scale = chroma
            .scale(data.colors.split(','))
            .colors(parseInt(data.count));
        parent.postMessage({ pluginMessage: Object.assign({ type: 'create-sclae' }, data, { scale }) }, '*');
    };
    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };
    return (React.createElement("div", null,
        React.createElement("img", { src: require('./logo.svg') }),
        React.createElement("h2", null, "Rectangle Creator"),
        React.createElement("p", null,
            "Comma separated colors:",
            ' ',
            React.createElement("input", { type: "text", value: data.colors, onChange: handleChange })),
        React.createElement("p", null,
            "Count: ",
            React.createElement("input", { value: data.count, onChange: handleChange })),
        React.createElement("button", { id: "create", onClick: onCreate }, "Create"),
        React.createElement("button", { onClick: onCancel }, "Cancel")));
};
ReactDOM.render(React.createElement(App, null), document.getElementById('react-page'));
