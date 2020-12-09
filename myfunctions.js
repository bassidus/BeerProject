function createElement(type, className = null, text = null, attr = null) {
    const element = document.createElement(type);
    if (className) element.className = className;
    if (text) { if (type === 'img') element.src = text; else element.innerHTML = text; }
    if (attr) element.setAttribute(attr.name, attr.value);
    return element;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getData(url, callback) {
    fetch(url).then(r => r.json()).then(callback).catch(e => console.log(e));
}