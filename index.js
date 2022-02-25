const { scrapeData, groupByCompany } = require("./scrapper");

async function runScript(){
    await scrapeData("last-7-days");
    groupByCompany("last-7-days");
}

runScript();