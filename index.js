const moment = require("moment");
const fs = require("fs");
const { scrapeCompaniesData, scrapeMarketData, fetchData, groupMarketDataByCompany } = require("./scrapper_v2");

// FIX: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' issue with API call
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

async function runScript() {
    try {
        //  fetch data
        let date = moment();
        for (let i = 0; i <= 7; i++) {
            try {
                let dateStr = date.subtract(1, 'days').format("YYYY-MM-DD");
                const data = await fetchData(dateStr);
                scrapeCompaniesData(data);
                scrapeMarketData(data, dateStr);
                groupMarketDataByCompany(data, dateStr);
                console.log("scraped data for", dateStr);
            } catch (e) {
                console.log(e);
                continue;
            }
        }

        // update info.json
        fs.writeFileSync("./data/info.json", JSON.stringify({
            name: "Nepse API",
            source: "https://nepalstock.com/",
            lastUpdatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        }));
        console.log("SUCCESS");
    } catch (e) {
        console.log(e);
        console.log("FAIL");
    }
}

runScript();