import brickHealthAtLevel from "./numbers/BrickHealth";
import getRandomStage from "./numbers/StageValues";

function CalculateInterest(e) {
    let totalCashOnHand = 0;
    let totalCashFromBricks = 0;
    let totalCashFromStageBonus = 0;
    let totalCashFromInterest = 0;
    let interestCapLevel = "N/A";

    const brickCashMulti = e.target.elements.brickCashMulti.value || 1;
    const cashBrickMulti = e.target.elements.cashBrickMulti.value || 10;
    const cashBrickChanceValue = e.target.elements.cashBrickChanceValue.value || 0.03;
    const cashBrickChance = cashBrickChanceValue / 100;
    const stageBonusMulti = e.target.elements.stageBonusMulti.value || 1;
    const allCashMulti = e.target.elements.allCashMulti.value || 1;

    const stageSkipPercent = e.target.elements.stageSkipPercent.value;
    const blackHoleStages = parseInt(e.target.elements.blackHoleStages.value);

    const interestLevel = e.target.elements.interestLevel.value;

    const interestPercent = getInterestPercent(interestLevel);
    const levels = e.target.elements.levels.value;

    function doesWarp() {
        return Math.floor(Math.random()*100) === 0;
    }

    function getInterestPercent(interestCardLevel) {
        if (interestCardLevel === '0') {
            return 0;
        }
        const interestCardValues = [0.001, 0.0015, 0.002, 0.0025, 0.003, 0.0035];
        return interestCardValues[interestCardLevel - 1];
    }

    function calculateStagesToSkip() {
        let stagesToSkip = 0;
        const randomInt = Math.floor(Math.random()*100);
        if (randomInt <= stageSkipPercent - 1) {
            stagesToSkip++;
            return stagesToSkip + calculateStagesToSkip();
        } else {
            return stagesToSkip;
        }
    }

    function calculateStageBrickValue(stage, health) {
        const {green, blue, red} = stage || {};
        let stageBrickValue = 0;
        if (green > 0) {
            const cashGreenCount = Math.floor(green * cashBrickChance);
            const regularGreenCount = green - cashGreenCount;
            const regularGreenValue = health * brickCashMulti * allCashMulti;
            const cashGreenValue = regularGreenValue * cashBrickMulti;
            stageBrickValue += (cashGreenCount * cashGreenValue) + (regularGreenCount * regularGreenValue);
        }
        if (blue > 0) {
            const cashBlueCount = Math.floor(blue * cashBrickChance);
            const regularBlueCount = blue - cashBlueCount;
            const regularBlueValue = 2 * health * brickCashMulti * allCashMulti;
            const cashBlueValue = regularBlueValue * cashBrickMulti;
            stageBrickValue += (cashBlueCount * cashBlueValue) + (regularBlueCount * regularBlueValue);
        }
        if (red > 0) {
            const cashRedCount = Math.floor(red * cashBrickChance);
            const regularRedCount = red - cashRedCount;
            const regularRedValue = 25 * health * brickCashMulti * allCashMulti;
            const cashRedValue = regularRedValue * cashBrickMulti;
            stageBrickValue += (cashRedCount * cashRedValue) + (regularRedCount * regularRedValue);
        }

        return stageBrickValue;
    }

    let currentLevel = 1;
    let totalStagesSkipped = 0;
    let interestCapReached = false;
    while (currentLevel <= levels) {
        const health = brickHealthAtLevel(currentLevel);
        const stage = getRandomStage();
        const stageBrickValue = calculateStageBrickValue(stage, health);
        const stageBonusValue = stageBrickValue * stageBonusMulti * 0.7;

        // add stage bonus
        totalCashFromStageBonus += stageBonusValue;
        totalCashOnHand += stageBonusValue;

        // add stage brick cash
        totalCashFromBricks += stageBrickValue;
        totalCashOnHand += stageBrickValue;

        // add stage interest
        const stageInterest = Math.min(totalCashOnHand * interestPercent, stageBonusValue * 100000);
        if (!interestCapReached && totalCashOnHand * interestPercent > stageBonusValue * 100000) {
            interestCapReached = true;
            interestCapLevel = currentLevel;
        }

        totalCashFromInterest += stageInterest;
        totalCashOnHand += stageInterest;


        // check for warps
        // on warp, multiply the current stage bonus by the black hole warp distance
        if (blackHoleStages > 0) {
            if (doesWarp()) {
                currentLevel += blackHoleStages;
                totalStagesSkipped += blackHoleStages - 1;
                totalCashOnHand += stageBonusValue * blackHoleStages;
                continue;
            }
        }

        // check for stage skips
        // on stage skip, multiply the current stage bonus by the number of skips
        const skips = parseInt(calculateStagesToSkip());
        if (skips > 0) {
            totalStagesSkipped += skips;
            totalCashFromStageBonus += stageBonusValue * skips;
            totalCashOnHand += stageBonusValue * skips;
            currentLevel += skips;
        }
        currentLevel++;
    }
    return [levels, totalStagesSkipped, totalCashOnHand, totalCashFromBricks, totalCashFromStageBonus, totalCashFromInterest, interestCapLevel];


}

export default CalculateInterest;