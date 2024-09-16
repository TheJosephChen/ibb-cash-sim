import brickHealthAtLevel from "./numbers/BrickHealth";
import getRandomStage from "./numbers/StageValues";

const BOMB_HEALTH_MULTI = 0.5;

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

    const interestLevel = e.target.elements.interestLevel.value || '0';
    const bombLevel = e.target.elements.bombLevel.value || '0';
    const stageSkipLevel = e.target.elements.stageSkipLevel.value || '0';

    const interestPercent = getInterestPercent(interestLevel);
    const bombPercent = getBombPercent(bombLevel);
    const stageSkipBonus = getStageSkipBonus(stageSkipLevel);
    const levels = e.target.elements.levels.value;

    function doesWarp() {
        return Math.floor(Math.random() * 100) === 0;
    }

    function getInterestPercent(interestCardLevel) {
        if (interestCardLevel === '0') {
            return 0;
        }
        const interestCardValues = [0.001, 0.0015, 0.002, 0.0025, 0.003, 0.0035, 0.0035, 0.0035, 0.0035, 0.0035, 0.0035, 0.0035];
        return interestCardValues[interestCardLevel - 1];
    }

    function getBombPercent(bombCardLevel) {
        if (bombCardLevel === '0') {
            return 0;
        }
        const bombCardValues = [0.1, 0.13, 0.16, 0.19, 0.22, 0.25, 0.28, 0.31, 0.34, 0.37, 0.4, 0.43];
        return bombCardValues[bombCardLevel - 1];
    }

    function getStageSkipBonus(stageSkipLevel) {
        if (stageSkipLevel === '0') {
            return 0;
        }
        const stageSkipMasteryValues = [1.25, 1.5, 1.75, 2, 2.25, 2.5];
        return stageSkipMasteryValues[stageSkipLevel - 1];
    }

    function calculateStagesToSkip() {
        let stagesToSkip = 0;
        const randomInt = Math.floor(Math.random() * 100);
        if (randomInt <= stageSkipPercent - 1) {
            stagesToSkip++;
            return stagesToSkip + calculateStagesToSkip();
        } else {
            return stagesToSkip;
        }
    }

    function calculateStageBrickValue(stage, health) {
        const { green, blue, red } = stage || {};
        let stageBrickValue = 0;
        if (green > 0) {
            const bombGreenCount = Math.floor(green * bombPercent);
            const cashGreenCount = Math.floor((green - bombGreenCount) * cashBrickChance);
            const regularGreenCount = green - bombGreenCount - cashGreenCount;
            const regularGreenValue = health * brickCashMulti * allCashMulti;
            const bombGreenValue = regularGreenValue * BOMB_HEALTH_MULTI;
            const cashGreenValue = regularGreenValue * cashBrickMulti;
            stageBrickValue += (bombGreenCount * bombGreenValue) + (cashGreenCount * cashGreenValue) + (regularGreenCount * regularGreenValue);
        }
        if (blue > 0) {
            const bombBlueCount = Math.floor(blue * bombPercent);
            const cashBlueCount = Math.floor((blue - bombBlueCount) * cashBrickChance);
            const regularBlueCount = blue - bombBlueCount - cashBlueCount;
            const regularBlueValue = 2 * health * brickCashMulti * allCashMulti;
            const bombBlueValue = regularBlueValue * BOMB_HEALTH_MULTI;
            const cashBlueValue = regularBlueValue * cashBrickMulti;
            stageBrickValue += (bombBlueCount * bombBlueValue) + (cashBlueCount * cashBlueValue) + (regularBlueCount * regularBlueValue);
        }
        if (red > 0) {
            const bombRedCount = Math.floor(red * bombPercent);
            const cashRedCount = Math.floor((red - bombRedCount) * cashBrickChance);
            const regularRedCount = red - bombRedCount - cashRedCount;
            const regularRedValue = 25 * health * brickCashMulti * allCashMulti;
            const bombRedValue = regularRedValue * BOMB_HEALTH_MULTI;
            const cashRedValue = regularRedValue * cashBrickMulti;
            stageBrickValue += (bombRedCount * bombRedValue) + (cashRedCount * cashRedValue) + (regularRedCount * regularRedValue);
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
        // if the stage skip card has masteries, include that bonus
        const skips = parseInt(calculateStagesToSkip());
        if (skips > 0) {
            totalStagesSkipped += skips;
            totalCashFromStageBonus += stageBonusValue * skips * stageSkipBonus;
            totalCashOnHand += stageBonusValue * skips;
            currentLevel += skips;
        }
        currentLevel++;
    }
    return [levels, totalStagesSkipped, totalCashOnHand, totalCashFromBricks, totalCashFromStageBonus, totalCashFromInterest, interestCapLevel];


}

export default CalculateInterest;