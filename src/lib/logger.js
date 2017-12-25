module.exports.log = function (msg) {
    const date = new Date();
    const dateString = date.toUTCString();
    console.log(`[${dateString}] ${msg}`);
};
