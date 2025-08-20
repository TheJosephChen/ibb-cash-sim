const HEALTH_EXPONENT = 1.32;
const GROWTH_EXPONENT = 1.4;

const cumulativeHealthMultipliers = {
    75: 1.2,
    100: 1.5,
    150: 2.1,
    200: 3.15,
    250: 5.04,
    300: 8.568,
    400: 15.4224,
    500: 30.8448,
    750: 77.122,
    1000: 192.78,
    1500: 481.95,
    2500: 1445.85,
    5000: 4337.55,
    7500: 15181.425,
    10000: 53134.9875,
    15000: 212539.95,
    20000: 850159.8,
    25000: 3400639.2,
    30000: 13602556.8,
    40000: 54410227.2,
    50000: 217640908.8,
    75000: 870563635.2,
    100000: 4352818176,
    125000: 26116909056,
    150000: 182818363392,
    175000: 1462546907136,
    200000: 13162922164224,
}

function getCumulativeHealthMulti(level) {
    let totalMulti = 1;
    for (const [key, value] of Object.entries(cumulativeHealthMultipliers)) {
        if (level >= parseInt(key)) {
            totalMulti = value;
        } else {
            break;
        }
    }
    return totalMulti;
}

function brickHealthAtLevel(level) {
    const totalMulti = getCumulativeHealthMulti(level);
    var growthMulti = 1;
    // post 200k, cumulative multi of x1.4 is applied per 100k levels
    if (level >= 300000) {
        const growthLevels = (level - 200000) / 100000;
        growthMulti = Math.pow(GROWTH_EXPONENT, growthLevels);
    }
    return totalMulti * (level ** HEALTH_EXPONENT) * growthMulti;
}

export default brickHealthAtLevel;