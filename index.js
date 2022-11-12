const moment = require("moment");
const { scrapeCompaniesData, scrapeMarketData, fetchData } = require("./scrapper_v2");

async function runScript() {
    let date = moment();
    for (let i = 0; i <= 7; i++) {
        let dateStr = date.subtract(1, 'days').format("YYYY-MM-DD");
        const data = await fetchData(dateStr);
        scrapeCompaniesData(data)
        scrapeMarketData(data)
        console.log("scraped data for", dateStr);
    }
}

runScript();