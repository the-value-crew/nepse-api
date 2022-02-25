const { scrapeData, groupByCompany } = require("./scrapper");
scrapeData("last-7-days");
groupByCompany("last-7-days");