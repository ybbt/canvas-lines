export class PointIntersection {
    pointPath;
    #colorFill;
    #colorStroke;
    #outlineWidth;
    #radius;

    constructor(center, radius, colorFill, colorStroke, outlineWidth) {
        this.#colorFill = colorFill;
        this.#colorStroke = colorStroke;
        this.#outlineWidth = outlineWidth;
        this.#radius = radius;
        this.#setPointPath(center);
    }

    #setPointPath(center) {
        this.pointPath = new Path2D();

        this.pointPath.arc(center.x, center.y, this.#radius, 0, 2 * Math.PI);
    }

    draw(context) {
        context.fillStyle = this.#colorFill;
        context.strokeStyle = this.#colorStroke;
        context.lineWidth = this.#outlineWidth;

        context.fill(this.pointPath);
        context.stroke(this.pointPath);
    }
}
