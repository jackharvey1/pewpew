const timestamp = () => +(new Date());

function extrapolateOrdinate(oldOrdinate, ordinateVelocity, time, direction) {
    if (direction === 'left') {
        ordinateVelocity = -Math.abs(ordinateVelocity);
    }

    const currentUnixTime = timestamp();
    const timeDifference = (currentUnixTime - time) / 1000;
    return oldOrdinate + (ordinateVelocity * timeDifference);
}

function getIntersectionWithWorldEdge(
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
}

function getIntersectionWithCircle(
    { centreX, centreY },
    { pointX, pointY },
    radius
) {
    const coefficient = radius / getLengthOfLine(centreX, centreY, pointX, pointY);
    return {
        circleX: (coefficient * (pointX - centreX)) + centreX,
        circleY: (coefficient * (pointY - centreY)) + centreY
    };
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

module.exports = {
    extrapolateOrdinate,
    timestamp,
    getIntersectionWithWorldEdge,
    getIntersectionWithCircle,
    getLengthOfLine,
    getGradient
};
