const axios = require("axios");
const cheerio = require("cheerio");

function mapStockData(stockData) {
  return stockData.data.map((row) => ({
    company: {
      code: row.symbol,
      name: row.fullname,
    },
    price: {
      open: row.open,
      max: row.high,
      min: row.low,
      close: row.latesttransactionprice,
      prevClose: row.previousclosing,
      diff: row.latesttransactionprice - row.previousclosing,
    },
    numTrans: null,
    tradedShares: row.volume,
    amount: null,
  }));
}

function formatDate(dateString) {
  return new Date(dateString).toISOString().split("T")[0];
}
function parseStockTable(rawHtml) {
  const $ = cheerio.load(rawHtml);
  const scriptTags = $("script").toArray();
  let extractedJson = null;
  scriptTags.forEach((script) => {
    let scriptContent = $(script).html();

    if (scriptContent.match(/HYDROPOWER/)) {
      scriptContent = scriptContent.replaceAll("self.__next_f.push(", "");
      scriptContent = scriptContent.replaceAll(
        '[1,"7:[\\"$\\",\\"$L1e\\",null,',
        ""
      );
      scriptContent = scriptContent.replaceAll("\n", "");
      scriptContent = scriptContent.replaceAll('\\"', '"');
      scriptContent = scriptContent.slice(0, -6);
      extractedJson = JSON.parse(scriptContent);
    }
  });
  return [mapStockData(extractedJson), formatDate(extractedJson.latestDate)];
}

async function scrapeNepseTrading() {
  try {
    // 1) Fetch the raw HTML from the site
    const { data: rawHtml } = await axios.get(
      "https://www.nepsetrading.com/market/stocks"
    );
    return parseStockTable(rawHtml);
  } catch (error) {
    console.error("Scraping failed:", error);
    throw error;
  }
}

module.exports = { scrapeNepseTrading };
