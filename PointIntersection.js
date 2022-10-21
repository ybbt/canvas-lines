export class PointIntersection {
    pointPath;
    #colorFill;
    #colorStroke;
    #outlineWidth;

    constructor(center, colorFill, colorStroke, outlineWidth) {
        this.#setPointPath(center);
        this.#colorFill = colorFill;
        this.#colorStroke = colorStroke;
        this.#outlineWidth = outlineWidth;
    }

    #setPointPath(center) {
        this.pointPath = new Path2D();

        this.pointPath.arc(center.x, center.y, 5, 0, 2 * Math.PI);
    }

    draw(context) {
        context.fillStyle = this.#colorFill;
        context.strokeStyle = this.#colorStroke;
        context.lineWidth = this.#outlineWidth;

        context.fill(this.pointPath);
        context.stroke(this.pointPath);
    }
}
