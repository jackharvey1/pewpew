'use strict';

module.exports.getIntersectionWithWorldEdge = function (
    { centreX, centreY },
    { pointX, pointY },
    { worldWidth, worldHeight }
) {
    const isMovingRight = (pointX - centreX) > 0;
    const isMovingUp = (pointY - centreY) > 0;
    let edgeX, edgeY;

    if (centreX === pointX) {
        return {
            edgeX: centreX,
            edgeY: isMovingUp ? worldHeight : 0
        };
    }

    const gradient = getGradient(centreX, centreY, pointX, pointY);
    const yIntercept = getYIntercept(centreX, centreY, gradient);
    const xAtBottom = solveForX(gradient, 0, yIntercept);
    const xAtTop = solveForX(gradient, worldHeight, yIntercept);
    const yAtLeft = solveForY(gradient, 0, yIntercept);
    const yAtRight = solveForY(gradient, worldWidth, yIntercept);

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

module.exports.getIntersectionWithCircle = function (
    { centreX, centreY },
    { pointX, pointY },
    radius
) {
    const inventedLine = {
        Cx: centreX + (pointX > centreX ? radius : -radius),
        Cy: centreY
    };

    let gamma = getAngleOfC({
        centreX,
        centreY
    }, {
        pointX,
        pointY
    },
    inventedLine
    );

    if (gamma > Math.PI / 2) {
        gamma -= Math.PI / 2;
    }

    const xMagnitude = radius * Math.cos(gamma);
    const yMagnitude = radius * Math.sin(gamma);

    const circleX = centreX += pointX > centreX ? xMagnitude : -xMagnitude;
    const circleY = centreY += pointY > centreY ? yMagnitude : -yMagnitude;

    return { circleX, circleY };
};

function getAngleOfC({ centreX, centreY }, { pointX, pointY }, { Cx, Cy }) {
    const a = getLengthOfLine(centreX, centreY, Cx, Cy);
    const b = getLengthOfLine(centreX, centreY, pointX, pointY);
    const c = getLengthOfLine(pointX, pointY, Cx, Cy);
    const numerator = (a ** 2) + (b ** 2) - (c ** 2);
    const denominator = 2 * a * b;
    return Math.acos(numerator / denominator);
}

function getLengthOfLine(Ax, Ay, Bx, By) {
    const xLength = (Ax - Bx) ** 2;
    const yLength = (Ay - By) ** 2;
    return Math.sqrt(xLength + yLength);
}

function solveForX(gradient, y, yIntercept) {
    return (y - yIntercept) / gradient;
}

function solveForY(gradient, x, yIntercept) {
    return (gradient * x) + yIntercept;
}

function getGradient(Ax, Ay, Bx, By) {
    const dy = By - Ay;
    const dx = Bx - Ax;
    return dy / dx;
}

function getYIntercept(x, y, m) {
    return y - (m * x);
}
