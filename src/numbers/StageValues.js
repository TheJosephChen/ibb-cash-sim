const Stages = [
    {"green": 93, "blue": 0,  "red": 6},
    {"green": 44, "blue": 18,  "red": 6},
    {"green": 22, "blue": 17,  "red": 6},
    {"green": 0, "blue": 60,  "red": 3},
    {"green": 45, "blue": 7,  "red": 4},
    {"green": 78, "blue": 12,  "red": 2},
    {"green": 0, "blue": 58,  "red": 1},
    {"green": 18, "blue": 36,  "red": 2},
    {"green": 94, "blue": 10,  "red": 1},
    {"green": 129, "blue":3 ,  "red": 0},
    {"green": 25, "blue": 16,  "red": 3},
    {"green": 68, "blue": 32,  "red": 0},
    {"green": 104, "blue": 0,  "red": 1},
    {"green": 54, "blue": 9,  "red": 2},
    {"green": 87, "blue": 2,  "red": 1},
    {"green": 76, "blue": 18,  "red": 0},
    {"green": 84, "blue": 14,  "red": 0},
    {"green": 110, "blue": 0,  "red": 0},
    {"green": 35, "blue": 35,  "red": 0},
    {"green": 76, "blue": 13,  "red": 0},
    {"green": 94, "blue": 0,  "red": 0},
    {"green": 72, "blue": 10,  "red": 0},
    {"green": 64, "blue": 13,  "red": 0},
];

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

function getRandomStage() {
    return Stages.random()
}

export default getRandomStage;