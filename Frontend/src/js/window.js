import {ObjectInspector} from "./inspectors/objectInspector.js";

export class Window {
    static newWindow(title, mainDiv, minusBehaviour = () => {}) {

        const window = document.createElement('div');
        window.classList.add('window');

        const titleBar = document.createElement('div');
        titleBar.classList.add('headerWindow');
        titleBar.appendChild(document.createTextNode(title));
        const closeButton = document.createElement('i');
        closeButton.classList.add('bi');
        closeButton.classList.add('bi-x');
        closeButton.classList.add('closeButton');
        closeButton.addEventListener('click', () => {
            window.remove();
            ObjectInspector.checkIfEmpty();
        });

        const minusButton = document.createElement('i');
        minusButton.classList.add('bi');
        minusButton.classList.add('bi-window-dash');
        minusButton.classList.add('closeButton');
        minusButton.addEventListener('click', () => {
            minusBehaviour();
            window.remove();
        });
        titleBar.appendChild(minusButton);
        titleBar.appendChild(closeButton);

        window.append(titleBar);
        window.append(mainDiv);
        Window.enableDrag(window, titleBar);

        mainDiv.style.border = 'none';

        return window;
    }

    static enableDrag(window, windowHeader) {
        windowHeader.onmousedown = (e) => {
            e = e || window.event;
            e.preventDefault();
            let x = e.clientX;
            let y = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            }
            document.onmousemove = (e) => {
                e = e || window.event;
                e.preventDefault();
                let newX = x - e.clientX;
                let newY = y - e.clientY;
                x = e.clientX;
                y = e.clientY;

                window.style.top = (window.offsetTop - newY) + 'px';
                window.style.left = (window.offsetLeft - newX) + 'px';
            }
        }
    }
}