const axios = require('axios');
const fs = require("fs");
const csvtojson = require("csvtojson/v2");

const transformCsvRow = (row) => {
    return ({
        company: {
            code: row.SYMBOL,
            name: row.SECURITY_NAME
        },
        price: {
            open: parseFloat(row.OPEN_PRICE),
            max: parseFloat(row.HIGH_PRICE),
            min: parseFloat(row.LOW_PRICE),
            close: parseFloat(row.CLOSE_PRICE),
            prevClose: parseFloat(row.PREVIOUS_DAY_CLOSE_PRICE),
            diff: parseFloat(row.CLOSE_PRICE - row.PREVIOUS_DAY_CLOSE_PRICE)
        },
        numTrans: parseFloat(row.TOTAL_TRADES),
        tradedShares: parseFloat(row.TOTAL_TRADED_QUANTITY),
        amount: parseFloat(row.TOTAL_TRADED_VALUE)
    })
}

const fetchData = async (date) => {
    return new Promise((resolve, reject) => {
        if (!date) reject();
        // simulate browser API call
        axios({
            method: "GET",
            url: `https://www.nepalstock.com.np/api/nots/market/export/todays-price/${date}`,
            headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' }
        })
            .then(function (resp) {
                csvtojson({ output: "json" })
                    .fromString(resp.data)
                    .then((json) => resolve(json))
            })
            .catch(e => reject(e))
    })
}

const scrapeCompaniesData = (data) => {
    let obj = {};
    data.forEach(d => {
        obj[d.SYMBOL] = {
            id: d.SECURITY_ID,
            name: d.SECURITY_NAME
        }
    });
    fs.writeFileSync("./data/companies.json", JSON.stringify(obj));
}

const scrapeMarketData = (csvRows, date) => {

    let meta = {
        totalAmt: 0,
        totalQty: 0,
        totalTrans: 0
    }

    let stocksData = csvRows.map(row => {
        meta.totalAmt += parseFloat(row.TOTAL_TRADED_VALUE)
        meta.totalQty += parseFloat(row.TOTAL_TRADED_QUANTITY)
        meta.totalTrans += parseFloat(row.TOTAL_TRADES)
        return transformCsvRow(row)
    })

    const merged = JSON.stringify({ metadata: meta, data: stocksData })

    fs.writeFileSync(`./data/date/${date}.json`, merged);
    fs.writeFileSync(`./data/date/today.json`, merged);
    fs.writeFileSync(`./data/date/latest.json`, merged);
}

const groupMarketDataByCompany = (csvRow, date) => {
    for (let row of csvRow) {
        let stockData = transformCsvRow(row);

        if (stockData && stockData.company && stockData.company.code) {
            let existingData = {};
            if (fs.existsSync(`./data/company/${stockData.company.code}.json`)) {
                try {
                    existingData = JSON.parse(fs.readFileSync(`./data/company/${stockData.company.code}.json`) || '{}');
                } catch (e) {
                    console.log(e);
                    existingData = {};
                }
            }
            let companyCode = stockData.company.code;
            delete stockData.company;
            existingData[date] = stockData;
            fs.writeFileSync(`./data/company/${companyCode.replace(/\//g, '\u2215')}.json`, JSON.stringify(existingData));
        }
    }
}

module.exports = { fetchData, scrapeCompaniesData, scrapeMarketData, groupMarketDataByCompany };