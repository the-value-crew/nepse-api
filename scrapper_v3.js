const axios = require("axios");
const fs = require("fs");
const { savedataFromPuppet } = require("./helpers/puppet");

const transformCsvRow = (row) => {
  return {
    company: {
      code: row["Symbol"],
      name: row["Security Name"],
    },
    price: {
      open: parseFloat(row["Open Price"]),
      max: parseFloat(row["High Price"]),
      min: parseFloat(row["Low Price"]),
      close: parseFloat(row["Close Price"]),
      prevClose: parseFloat(row["Previous Day Close Price"]),
      diff: parseFloat(row["Close Price"] - row["Previous Day Close Price"]),
    },
    numTrans: parseFloat(row["Total Trades"]),
    tradedShares: parseFloat(row["Total Traded Quantity"]),
    amount: parseFloat(row["Total Traded Value"]),
  };
};

const fetchData = async (date) => {
  return new Promise(async (resolve, reject) => {
    if (!date) reject();
    const [yyyy, mm, dd] = date.split("-");
    const data = await savedataFromPuppet(`${dd}-${mm}-${yyyy}`);
    if (data) return resolve(data);
    else return reject(false);
  });
};

const scrapeCompaniesData = (data) => {
  let obj = {};
  data.forEach((d) => {
    obj[d.SYMBOL] = {
      id: d.SECURITY_ID,
      name: d.SECURITY_NAME,
    };
  });
  fs.writeFileSync("./data/companies.json", JSON.stringify(obj));
};

const scrapeMarketData = (csvRows, date) => {
  let meta = {
    totalAmt: 0,
    totalQty: 0,
    totalTrans: 0,
  };

  let stocksData = csvRows.map((row) => {
    meta.totalAmt += parseFloat(row.TOTAL_TRADED_VALUE);
    meta.totalQty += parseFloat(row.TOTAL_TRADED_QUANTITY);
    meta.totalTrans += parseFloat(row.TOTAL_TRADES);
    return transformCsvRow(row);
  });

  const merged = JSON.stringify({ metadata: meta, data: stocksData });

  fs.writeFileSync(`./data/date/${date}.json`, merged);
  fs.writeFileSync(`./data/date/today.json`, merged);
  fs.writeFileSync(`./data/date/latest.json`, merged);
};

const groupMarketDataByCompany = (csvRow, date) => {
  for (let row of csvRow) {
    let stockData = transformCsvRow(row);

    if (stockData && stockData.company && stockData.company.code) {
      let existingData = {};
      if (fs.existsSync(`./data/company/${stockData.company.code}.json`)) {
        try {
          existingData = JSON.parse(
            fs.readFileSync(`./data/company/${stockData.company.code}.json`) ||
              "{}"
          );
        } catch (e) {
          console.log(e);
          existingData = {};
        }
      }
      let companyCode = stockData.company.code;
      delete stockData.company;
      existingData[date] = stockData;
      fs.writeFileSync(
        `./data/company/${companyCode.replace(/\//g, "\u2215")}.json`,
        JSON.stringify(existingData)
      );
    }
  }
};

module.exports = {
  fetchData,
  scrapeCompaniesData,
  scrapeMarketData,
  groupMarketDataByCompany,
};
