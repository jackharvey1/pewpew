'use strict';

module.exports.getIntersectionWithWorldEdge = function ({ centreX, centreY }, { pointX, pointY }, { worldWidth, worldHeight }) {
    const isMovingRight = (pointX - centreX) > 0;
    const isMovingUp = (pointY - centreY) > 0;
    let edgeX, edgeY;

    if (centreX === pointX) {
        return {
            edgeX: centreX,
            edgeY: isMovingUp ? worldHeight : 0
        };
    }

    if (centreY === pointY) {
        return {
            edgeX: isMovingRight ? worldWidth : 0,
            edgeY: pointY
        };
    }

    const gradient = getGradient(centreX, centreY, pointX, pointY);
    const c = getC(centreX, centreY, gradient);
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
    let circleX, circleY;

    if (centreX === pointX) {
        circleX = centreX;
        if (centreY < pointY) {
            circleY = centreY + radius;
        } else {
            circleY = centreY - radius;
        }
        return { circleX, circleY };
    } else if (centreY === pointY) {
        circleY = centreY;
        if (centreX < pointX) {
            circleX = centreX + radius;
        } else {
            circleX = centreX - radius;
        }
        return { circleX, circleY };
    }

    let gamma = getAngleOfC({
        centreX: centreX,
        centreY: centreY
    }, {
        pointX: pointX,
        pointY: pointY
    }, {
        Cx: centreX + radius,
        Cy: centreY
    });

    if (gamma > Math.PI / 2) {
        gamma -= Math.PI / 2;
    }

    const xMagnitude = radius * Math.cos(gamma);
    const yMagnitude = radius * Math.sin(gamma);

    if (pointX > centreX) {
        circleX = centreX + xMagnitude;
    } else {
        circleX = centreX - xMagnitude;
    }

    if (pointY > centreY) {
        circleY = centreY + yMagnitude;
    } else {
        circleY = centreY - yMagnitude;
    }

    return { circleX, circleY };
};

function getAngleOfC({ centreX, centreY }, { pointX, pointY }, { Cx, Cy }) {
    // Law of cosines, return angle BAC
    const a = getLengthOfLine(centreX, centreY, Cx, Cy);
    const b = getLengthOfLine(centreX, centreY, pointX, pointY);
    const c = getLengthOfLine(pointX, pointY, Cx, Cy);
    const numerator = (a ** 2) + (b ** 2) - (c ** 2);
    const denominator = 2 * a * b;
    return Math.acos(numerator / denominator);
}

// function radiansToDegrees(radians) {
//     return radians * (180 / Math.PI);
// }

function getLengthOfLine(Ax, Ay, Bx, By) {
    const xLength = (Ax - Bx) ** 2;
    const yLength = (Ay - By) ** 2;
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
