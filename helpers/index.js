const { savedataFromPuppet, deleteDownloadedCSV } = require("./puppet");

const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync("./data/companies.json"));
const moment = require("moment");
const {
  scrapeCompaniesData,
  scrapeMarketData,
  groupMarketDataByCompany,
} = require("../scrapper_v3");

const searchCompanyByName = (keyword) => {
  try {
    if (!keyword) return [{ name: keyword, code: null, cat: null }];
    const results = [];
    for (const compCode in DATA)
      if (DATA[compCode].name.toLowerCase().includes(keyword.toLowerCase()))
        results.push({ code: compCode, ...DATA[compCode] });

    return results.length
      ? results
      : [{ name: keyword, code: null, cat: null }];
  } catch (e) {
    return [{ name: keyword, code: null, cat: null }];
  }
};

const allCompanies = () => DATA;

const lastMarketDay = (dateStr) => {
  /* 
        - Nepse is open for sun-wed only
        - It's closed on public holidays
    */
  let date;
  if (dateStr) date = moment(dateStr, "YYYY-MM-DD");
  else date = moment();
  let day = date.day();

  // friday & saturday
  if (day == 5) date = date.subtract(1, "day");
  if (day == 6) date = date.subtract(2, "day");

  return date.format("YYYY-MM-DD");
};

async function downloadAllDataFromOct22() {
  const start = new Date(2024, 9, 22);
  // Define the end date as "today"
  const end = new Date();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Convert to DD-MM-YYYY
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const dateStr = `${yyyy}-${mm}-${dd}`;
    console.log(`\n=== Downloading data for: ${dateStr} ===`);
    try {
      if (fs.existsSync(`./data/date/${dateStr}.json`)) continue;

      const data = await fetchData(dateStr);
      if (data) {
        scrapeCompaniesData(data);
        scrapeMarketData(data, dateStr);
        groupMarketDataByCompany(data, dateStr);
        console.log("scraped data for", dateStr);
        deleteDownloadedCSV(dateStr);
      }
    } catch (e) {
      console.log(e);
      continue;
    }
  }
}

module.exports = {
  searchCompanyByName,
  allCompanies,
  lastMarketDay,
  downloadAllDataFromOct22,
};
