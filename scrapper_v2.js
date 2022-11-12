const axios = require('axios');
const fs = require("fs");
const moment = require("moment");
const csvtojson = require("csvtojson/v2");

const lastMarketDay = () => {
    /* 
        - Nepse is open for sun-wed only
        - It's closed on public holidays
    */

    let date = moment();
    let day = date.day();

    // friday & saturday
    if (day == 5) date = date.subtract(1, 'day');
    if (day == 6) date = date.subtract(2, 'day');

    return date.format("YYYY-MM-DD");
}

const fetchData = async (date) => {
    if (!date) date = lastMarketDay();

    return new Promise((resolve, reject) => {
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

const scrapeMarketData = (data) => {

    let meta = {
        totalAmt: 0,
        totalQty: 0,
        totalTrans: 0
    }

    let stocksData = data.map(d => {

        meta.totalAmt += parseFloat(d.TOTAL_TRADED_VALUE)
        meta.totalQty += parseFloat(d.TOTAL_TRADED_QUANTITY)
        meta.totalTrans += parseFloat(d.TOTAL_TRADES)

        return ({
            company: {
                code: d.SYMBOL,
                name: d.SECURITY_NAME
            },
            price: {
                open: parseFloat(d.OPEN_PRICE),
                max: parseFloat(d.HIGH_PRICE),
                min: parseFloat(d.LOW_PRICE),
                close: parseFloat(d.CLOSE_PRICE),
                prevClose: parseFloat(d.PREVIOUS_DAY_CLOSE_PRICE),
                diff: parseFloat(d.CLOSE_PRICE - d.PREVIOUS_DAY_CLOSE_PRICE)
            },
            numTrans: parseFloat(d.TOTAL_TRADES),
            tradedShares: parseFloat(d.TOTAL_TRADED_QUANTITY),
            amount: parseFloat(d.TOTAL_TRADED_VALUE)
        })
    })

    const merged = JSON.stringify({
        metadata: meta,
        data: stocksData
    })

    fs.writeFileSync(`./data/date/${lastMarketDay()}.json`, merged);
    fs.writeFileSync(`./data/date/today.json`, merged);
    fs.writeFileSync(`./data/date/latest.json`, merged);
}

module.exports = { fetchData, scrapeCompaniesData, scrapeMarketData };