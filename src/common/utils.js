'use strict';

module.exports.getIntersectionWithWorldEdge = function ({ Ax, Ay }, { Bx, By }, { worldWidth, worldHeight }) {
    const isMovingRight = (Bx - Ax) > 0;
    const isMovingUp = (By - Ay) > 0;
    let edgeX, edgeY;

    if (Ax === Bx) {
        return {
            edgeX: Ax,
            edgeY: isMovingUp ? worldHeight : 0
        };
    }

    if (Ay === By) {
        return {
            edgeX: isMovingRight ? worldWidth : 0,
            edgeY: By
        };
    }

    const gradient = getGradient(Ax, Ay, Bx, By);
    const c = getC(Ax, Ay, gradient);
    const xAtBottom = solveForX(gradient, 0, c);
    const xAtTop = solveForX(gradient, worldHeight, c);
    const yAtLeft = solveForY(gradient, 0, c);
    const yAtRight = solveForY(gradient, worldWidth, c);

    if (xAtTop >= 0 && xAtTop <= worldWidth && isMovingUp) {
        edgeX = xAtTop;
        edgeY = worldHeight;
    }

    if (yAtRight >= 0 && yAtRight <= worldHeight && isMovingRight) {
        edgeX = worldWidth;
        edgeY = yAtRight;
    }

    if (yAtLeft >= 0 && yAtLeft <= worldHeight && !isMovingRight) {
        edgeX = 0;
        edgeY = yAtLeft;
    }

    if (xAtBottom >= 0 && xAtBottom <= worldWidth && !isMovingUp) {
        edgeX = xAtBottom;
        edgeY = 0;
    }

    return { edgeX, edgeY };
};

module.exports.getIntersectionWithCircle = function ({ centreX, centreY }, { pointX, pointY }, radius) {
    const theta = getAngleOfC({
        Ax: centreX,
        Ay: centreY
    }, {
        Bx: pointX,
        By: pointY
    }, {
        Cx: centreX + radius,
        Cy: centreY
    });
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    // console.log('intersection:', theta, x, y);

    return { circleX: x, circleY: y };
};

function getAngleOfC({ Ax, Ay }, { Bx, By }, { Cx, Cy }) {
    // Law of cosines, return angle BAC
    const a = getLengthOfLine(Bx, By, Cx, Cy);
    const b = getLengthOfLine(Ax, Ay, Cx, Cy);
    const c = getLengthOfLine(Ax, Ay, Bx, By);
    // console.log('angle of c:', a, b, c);
    const numerator = (c ** 2) - (a ** 2) - (b ** 2);
    const denominator = 2 * a * b;
    return Math.acos(numerator / denominator);
}

function getLengthOfLine(Ax, Ay, Bx, By) {
    // console.log(Ax - Bx);
    // console.log((Ax - Bx) ** 2);
    const xLength = (Ax - Bx) ** 2;
    const yLength = (Ay - By) ** 2;
    // console.log('length:', xLength, yLength, Math.sqrt(xLength + yLength));
    return Math.sqrt(xLength + yLength);
}

function solveForX(gradient, y, yAtZeroX) {
    return (y - yAtZeroX) / gradient;
}

function solveForY(gradient, x, yAtZeroX) {
    return (gradient * x) + yAtZeroX;
}

function getGradient(Ax, Ay, Bx, By) {
    const dy = By - Ay;
    const dx = Bx - Ax;
    return dy / dx;
}

function getC(x, y, m) {
    return y - (m * x);
}
