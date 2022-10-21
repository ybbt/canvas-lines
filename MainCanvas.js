import { Line } from './Line.js';

export class MainCanvas {
    #canvas;
    #context;
    #button;
    mouse;
    #isDraw = false;
    #objects = [];
    #lineStartPoint = { x: 0, y: 0 };
    #isAnimationProcess = false;

    constructor() {
        this.#setCanvas();

        this.#context = this.#canvas.getContext('2d');

        this.#setButton();

        this.mouse = { x: 0, y: 0 };
    }

    #setCanvas() {
        this.#canvas = document.getElementById('myCanvas');

        this.#canvas.addEventListener('mousedown', this.#onMouseDownCanvas.bind(this));

        this.#canvas.addEventListener('mousemove', this.#onMouseMoveCanvas.bind(this));
    }

    #setButton() {
        this.#button = document.getElementById('collapse');

        this.#button.addEventListener('click', this.#onClickButton.bind(this));
    }

    #onMouseDownCanvas(e) {
        if (e.button === 2) {
            e.preventDefault();
            this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

            this.#displayObjects(this.#objects);

            this.#isDraw = false;
            return;
        }
        if (!this.#isAnimationProcess) {
            if (!this.#isDraw) {
                this.mouse.x = e.pageX - this.#canvas.offsetLeft;
                this.mouse.y = e.pageY - this.#canvas.offsetTop;
                this.#isDraw = true;
                this.#lineStartPoint.x = this.mouse.x;
                this.#lineStartPoint.y = this.mouse.y;
            } else {
                this.mouse.x = e.pageX - this.#canvas.offsetLeft;
                this.mouse.y = e.pageY - this.#canvas.offsetTop;

                const line = new Line(this.#lineStartPoint, this.mouse, 'black', 2);
                line.setPointsIntersection(this.#objects);

                this.#objects.push(line);

                this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

                this.#displayObjects(this.#objects);

                this.#isDraw = false;
            }
        }
    }

    #onMouseMoveCanvas(e) {
        if (this.#isDraw) {
            this.mouse.x = e.pageX - this.#canvas.offsetLeft;
            this.mouse.y = e.pageY - this.#canvas.offsetTop;

            const line = new Line(this.#lineStartPoint, this.mouse, 'black', 2);
            line.setPointsIntersection(this.#objects);

            this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

            this.#displayObjects(this.#objects);

            this.#displayObject(line);
        }
    }

    #onClickButton(e) {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        const animationTime = 3000;
        const fullAnimationStep = 120;

        this.#objects.forEach((object) => {
            object.setAnimationStep(fullAnimationStep);
        });

        let animationStep = 0;

        this.#isAnimationProcess = true;

        const timer = setInterval(
            function () {
                if (++animationStep > fullAnimationStep) {
                    this.#objects = [];
                    clearInterval(timer);
                    this.#isAnimationProcess = false;
                    return;
                }

                this.#objects.forEach((object, index, objectsArray) => {
                    object.calculateAnimation(fullAnimationStep);

                    object.setPointsIntersection(objectsArray, index);
                });

                this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

                this.#displayObjects(this.#objects);
            }.bind(this),
            animationTime / fullAnimationStep
        );
    }

    #displayObjects(objects) {
        if (objects) {
            objects.forEach((object) => {
                this.#displayObject(object);
            });
        }
    }

    #displayObject(object) {
        object.draw(this.#context);
    }
}
