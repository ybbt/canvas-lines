import { PointIntersection } from './PointIntersection.js';

export class Line {
    linePath;
    line;
    #color;
    #lineWidth;
    #points = [];
    #stepAnimationX = null;
    #stepAnimationY = null;

    constructor(firstPoint, lastPoint, color, lineWidth) {
        this.#setLinePath(firstPoint, lastPoint);

        this.#setLine(firstPoint, lastPoint);

        this.#color = color;
        this.#lineWidth = lineWidth;
    }

    #setLine(firstPoint, lastPoint) {
        if (firstPoint.x < lastPoint.x) {
            this.line = {
                pointStart: { ...firstPoint },
                pointEnd: { ...lastPoint },
            };
        } else {
            this.line = {
                pointStart: { ...lastPoint },
                pointEnd: { ...firstPoint },
            };
        }
    }

    #setLinePath(firstPoint, lastPoint) {
        this.linePath = new Path2D();
        this.linePath.moveTo(firstPoint.x, firstPoint.y);
        this.linePath.lineTo(lastPoint.x, lastPoint.y);
    }

    setPointsIntersection(objects, objectIndex) {
        const pointsIntersection = [];

        objects.forEach((object, index) => {
            if (objectIndex && index >= objectIndex) {
                return;
            }
            const pointIntersectionCoord = this.#getPointIntersection(this.line, object.line);
            if (pointIntersectionCoord) {
                const pointIntersection = new PointIntersection(pointIntersectionCoord, 10, 'red', 'black', 1);

                pointsIntersection.push(pointIntersection);
            }
        });

        this.#points = pointsIntersection;
    }

    #getPointIntersection(line1, line2) {
        const k1 = this.#getSlope(line1);
        const k2 = this.#getSlope(line2);
        if (k1 === k2) {
            return null;
        }
        const b1 = this.#getFreeTerm(line1, k1);
        const b2 = this.#getFreeTerm(line2, k2);

        const x = (b2 - b1) / (k1 - k2);
        const y = k1 * x + b1;

        const belongLineSegmentFirst = line1.pointStart.x <= x && x <= line1.pointEnd.x;
        const belongLineSegmentSecond = line2.pointStart.x <= x && x <= line2.pointEnd.x;

        if (belongLineSegmentFirst && belongLineSegmentSecond) {
            return { x, y };
        }

        return null;
    }

    #getSlope(line) {
        if (line.pointStart.y === line.pointEnd.y) {
            return 0;
        } else {
            return (line.pointEnd.y - line.pointStart.y) / (line.pointEnd.x - line.pointStart.x);
        }
    }

    #getFreeTerm(line, k) {
        return line.pointStart.y - k * line.pointStart.x;
    }

    calculateAnimation(stepsQuant) {
        const newPointStart = {
            x: this.line.pointStart.x + this.#stepAnimationX,
            y: this.line.pointStart.y + this.#stepAnimationY,
        };

        const newPointEnd = {
            x: this.line.pointEnd.x - this.#stepAnimationX,
            y: this.line.pointEnd.y - this.#stepAnimationY,
        };

        this.#setLinePath({ ...newPointStart }, { ...newPointEnd });

        this.line = {
            pointStart: { ...newPointStart },
            pointEnd: { ...newPointEnd },
        };

        this.#points = [];
    }

    setAnimationStep(stepsQuant) {
        this.#stepAnimationX = (this.line.pointEnd.x - this.line.pointStart.x) / (stepsQuant * 2);
        this.#stepAnimationY = (this.line.pointEnd.y - this.line.pointStart.y) / (stepsQuant * 2);
    }

    draw(context) {
        context.strokeStyle = this.#color;
        context.lineWidth = this.#lineWidth;
        context.stroke(this.linePath);

        this.#points.forEach((point) => {
            point.draw(context);
        });
    }
}
