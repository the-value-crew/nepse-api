const moment = require("moment");
const fs = require("fs");
const {
  scrapeCompaniesData,
  scrapeMarketData,
  fetchData,
  groupMarketDataByCompany,
} = require("./scrapper_v2");
const { lastMarketDay } = require("./helpers");

// FIX: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' issue with API call
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const targetTime = moment("14:59:59", "HH:mm:ss");
// const currentTime = moment();

// setIsAfterTargetTime(currentTime.isAfter(targetTime));

async function runScript() {
  try {
    //  fetch last 7 market-days data
    let date = moment();
    for (let i = 0; i <= 7; i++) {
      try {
        if (date.isAfter(targetTime)) {
          let dateStr = date.format("YYYY-MM-DD");

          if (fs.existsSync(`./data/date/${dateStr}.json`)) continue;

          const data = await fetchData(dateStr);
          scrapeCompaniesData(data);
          scrapeMarketData(data, dateStr);
          groupMarketDataByCompany(data, dateStr);
          console.log("scraped data for", dateStr);
        } else {
          let dateStr = lastMarketDay(
            date.subtract(1, "days").format("YYYY-MM-DD")
          );
          // }

          if (fs.existsSync(`./data/date/${dateStr}.json`)) continue;

          const data = await fetchData(dateStr);
          scrapeCompaniesData(data);
          scrapeMarketData(data, dateStr);
          groupMarketDataByCompany(data, dateStr);
          console.log("scraped data for", dateStr);
        }
      } catch (e) {
        console.log(e);
        continue;
      }
    }

    // update info.json
    fs.writeFileSync(
      "./data/info.json",
      JSON.stringify({
        name: "Nepse API",
        source: "https://nepalstock.com/",
        lastUpdatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
    );
    console.log("SUCCESS");
  } catch (e) {
    console.log(e);
    console.log("FAIL");
  }
}

runScript();
