const { log } = require("console");

const currdate = Math.round(new Date('2024-02-02').getTime() / 1000);

log(currdate + 86400);
