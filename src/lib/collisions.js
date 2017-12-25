module.exports = function (rectangle, line) {
    const minX = rectangle.x - (rectangle.width / 2);
    const minY = rectangle.y - (rectangle.height / 2);
    const maxX = rectangle.x + (rectangle.width / 2);
    const maxY = rectangle.y + (rectangle.height / 2);

    const lineIsLeftOfRectangle = line.originX <= minX && line.endX <= minX;
    const lineIsBelowRectangle = line.originY <= minY && line.endY <= minY;
    const lineIsRightOfRectangle = line.originX >= maxX && line.endX >= maxX;
    const lineIsAboveRectangle = line.originY >= maxY && line.endY >= maxY;

    return !lineIsLeftOfRectangle &&
        !lineIsBelowRectangle &&
        !lineIsRightOfRectangle &&
        !lineIsAboveRectangle;
};
