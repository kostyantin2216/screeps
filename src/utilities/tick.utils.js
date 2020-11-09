

function executionDelay(fn, ticks) {
    let tickCount = 0;
    return function() {
        tickCount++;
        if (tickCount % ticks === 0) {
            fn.apply(this, arguments);
        }
    };
}

module.exports = {
    executionDelay,
};