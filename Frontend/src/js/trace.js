import { FunctionTrace } from './def.js';

const lineNumbers = document.querySelector('.lineNumbers');
const triangles = document.querySelector('.traceTriangles');
const traceContent = document.querySelector('.traceContent');

function addTraceLine(ft) {
    lineNumbers.appendChild(document.createTextNode(ft.line));
    lineNumbers.appendChild(document.createElement('br'));

    /*let triangle = document.createElement('li');
    triangle.innerHTML = ft.triangle;
    triangles.appendChild(triangle);*/

    traceContent.appendChild(document.createTextNode(ft.content));
    //traceContent.insertAdjacentText('afterbegin', '\n');
}

window.addEventListener('load', function() {
    let ft = new FunctionTrace("blabla", null, 1, 10, "content");
    addTraceLine(ft);
});
