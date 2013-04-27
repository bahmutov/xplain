function rethrow(err) {
    if (err) {
        throw err;
    }
}

module.exports = {
    rethrow: rethrow
};