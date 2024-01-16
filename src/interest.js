import brickHealthAtLevel from "./numbers/BrickHealth";
import getRandomStage from "./numbers/StageValues";

const BOMB_HEALTH_MULTI = 0.5;

function CalculateInterest(e) {
    let totalCashOnHand = 0;
    let totalCashFromBricks = 0;
    let totalCashFromStageBonus = 0;
    let totalCashFromInterest = 0;

    const brickCashMulti = e.target.elements.brickCashMulti.value || 1;
    const cashBrickMulti = e.target.elements.cashBrickMulti.value || 10;
    const cashBrickChance = e.target.elements.cashBrickChance.value || 0.03;
    const stageBonusMulti = e.target.elements.stageBonusMulti.value || 1;
    const allCashMulti = e.target.elements.allCashMulti.value || 1;

    const stageSkipPercent = e.target.elements.stageSkipPercent.value;
    const blackHoleStages = parseInt(e.target.elements.blackHoleStages.value);

    const interestLevel = e.target.elements.interestLevel.value;
    const bombLevel = e.target.elements.bombLevel.value;

    const interestPercent = getInterestPercent(interestLevel)
    const bombPercent = getBombPercent(bombLevel)
    const levels = e.target.elements.levels.value;

    function doesWarp() {
        return Math.floor(Math.random()*100) === 0;
    }

    function getInterestPercent(interestCardLevel) {
        const interestCardValues = [0.001, 0.0015, 0.002, 0.0025, 0.003, 0.0035];
        return interestCardValues[interestCardLevel - 1];
    }

    function getBombPercent(bombCardLevel) {
        const bombCardValues = [0.1, 0.13, 0.16, 0.19, 0.22, 0.25];
        return bombCardValues[bombCardLevel - 1];
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
            const bombGreenCount = Math.floor((green - cashGreenCount) * bombPercent);
            const regularGreenCount = green - cashGreenCount - bombGreenCount;
            const regularGreenValue = health * brickCashMulti * allCashMulti;
            const cashGreenValue = regularGreenValue * cashBrickMulti;
            const bombGreenValue = regularGreenValue * BOMB_HEALTH_MULTI;
            stageBrickValue += (cashGreenCount * cashGreenValue) + (bombGreenCount * bombGreenValue) + (regularGreenCount * regularGreenValue);
        }
        if (blue > 0) {
            const cashBlueCount = Math.floor(blue * cashBrickChance);
            const bombBlueCount = Math.floor((blue - cashBlueCount) * bombPercent);
            const regularBlueCount = blue - cashBlueCount - bombBlueCount;
            const regularBlueValue = 2 * health * brickCashMulti * allCashMulti;
            const cashBlueValue = regularBlueValue * cashBrickMulti;
            const bombBlueValue = regularBlueValue * BOMB_HEALTH_MULTI;
            stageBrickValue += (cashBlueCount * cashBlueValue) + (bombBlueCount * bombBlueValue) + (regularBlueCount * regularBlueValue);
        }
        if (red > 0) {
            const cashRedCount = Math.floor(red * cashBrickChance);
            const bombRedCount = Math.floor((red - cashRedCount) * bombPercent);
            const regularRedCount = red - cashRedCount - bombRedCount;
            const regularRedValue = 25 * health * brickCashMulti * allCashMulti;
            const cashRedValue = regularRedValue * cashBrickMulti;
            const bombRedValue = regularRedValue * BOMB_HEALTH_MULTI;
            stageBrickValue += (cashRedCount * cashRedValue) + (bombRedCount * bombRedValue) + (regularRedCount * regularRedValue);
        }

        return stageBrickValue;
    }

    let currentLevel = 1;
    let totalStagesSkipped = 0;
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
    return [levels, totalStagesSkipped, totalCashOnHand, totalCashFromBricks, totalCashFromStageBonus, totalCashFromInterest];


}

export default CalculateInterest;