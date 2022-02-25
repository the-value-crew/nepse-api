const axios = require('axios');
const fs = require("fs");
const path = require("path");
const { searchCompanyByName } = require("./helpers");
const { JSDOM } = require("jsdom");
const moment = require("moment");
const DATE_FORMAT = "YYYY-MM-DD";

const _fetchListedCompanies = async () => {
    const { data } = await axios({
        method: 'post',
        url: 'http://www.nepalstock.com/company',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: `_limit=500`,
    });

    const dom = new JSDOM(data);
    let arr = Array.from(dom.window.document.querySelectorAll('#company-list table tr'));
    arr.splice(0, 2); // remove top info
    arr.pop(); // remove pagination

    const companies = {};
    arr.forEach((a, i) => {
        let data = a.textContent.trim().split("\n").map(e => e.trim()).filter(e => {
            if (!e || (e && !e.length)) return false;
            if (!isNaN(e)) return false;
            if (e == "View" || e == "Logo Unavailable") return false;
            return true;
        });
        companies[data[1]] = {
            name: data[0],
            cat: data[2]
        };
    })
    fs.writeFileSync("./data/companies.json", JSON.stringify(companies));
    console.log("Fetched", arr.length, "companies meta-data");
}

const _fetchDataOfDate = async (date, latest = false) => {
    try {
        const { data } = await axios({
            method: 'post',
            url: 'http://www.nepalstock.com/todaysprice',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: `startDate=${date}&stock-symbol=&_limit=500`,
        });
        const dom = new JSDOM(data);
        let arr = Array.from(dom.window.document.querySelectorAll('table.table.table-condensed.table-hover tr'));
        arr.splice(0, 2); // remove top info
        arr.splice(arr.length - 4, 1); // remove pagination

        let stockData = [];
        let metadata = {};

        // last 3 is metadata
        let arrLen = arr.length;
        for (let i = 0; i < arrLen; i++) {
            let data = arr[i].textContent.trim().split("\n").filter(e => e && e.length).map(e => {
                let d = e.trim().replace(/,/g, '');
                if (!isNaN(d)) d = parseFloat(d);
                return d;
            });

            // metadata
            let diff = arrLen - i;
            if (diff < 4) {
                if (diff == 1) metadata.totalTrans = data[1];
                else if (diff == 2) metadata.totalQty = data[1];
                else if (diff == 3) metadata.totalAmt = data[1];
            }
            else {
                data.shift(); // removes SN
                let compDetails = searchCompanyByName(data[0]).pop();
                stockData.push({
                    company: compDetails,
                    price: {
                        max: data[2] || null,
                        min: data[3] || null,
                        close: data[4] || null,
                        prevClose: data[7] || null,
                        diff: data[8] || null,
                    },
                    numTrans: data[1] || null,
                    tradedShares: data[5] || null,
                    amount: data[6] || null,
                });
            }
        }

        fs.writeFileSync(`./data/date/${date}.json`, JSON.stringify({ metadata, data: stockData }));
        return stockData.length ? true : false;
    } catch (e) {
        console.log(e);
    }
}

const scrapeData = async (mode = "last-7-days") => {

    // fetch listed companies
    await _fetchListedCompanies();

    // fetch data
    let start;
    if (mode == "all") start = moment('2008-01-01', DATE_FORMAT);
    else if (mode == "last-7-days") start = moment().subtract(1, 'w', DATE_FORMAT);
    let days = moment().diff(start, 'days');
    for (let i = 0; i < days; i++) {
        start.add(1, 'days');
        let date = start.format(DATE_FORMAT);
        let dataFetched = await _fetchDataOfDate(date);
        console.log("Fetching", date, dataFetched ? "Done" : "Data Empty");
        if (dataFetched) fs.copyFileSync(`./data/date/${date}.json`, `./data/date/latest.json`);
    }

    // logs info
    fs.writeFileSync("./data/info.json", JSON.stringify({
        Name: "Nepse daily data API",
        lastUpdatedAt: moment().format("YYYY-MM-DD HH:mm:ss")
    }));

    console.log("Data fetch completed");
}

const groupByCompany = async (mode = "last-7-days") => {
    let start;
    if (mode == "all") start = moment('2008-01-01', DATE_FORMAT);
    else if (mode == "last-7-days") start = moment().subtract(1, 'w', DATE_FORMAT);
    let days = moment().diff(start, 'days');
    for (let i = 0; i < days; i++) {
        start.add(1, 'days');
        let date = start.format(DATE_FORMAT);

        let stocksDataList;
        try {

            // read each date
            stocksDataList = JSON.parse(fs.readFileSync(`./data/date/${date}.json`));

            // each company on each date
            for (let i = 0; i < stocksDataList.data.length; i++) {
                const stocksData = stocksDataList.data[i];
                let compCode = stocksData.company.code;
                // if company is listed on Nepse
                if (compCode) {
                    // console.log(compCode);
                    let existingData = {};
                    if (fs.existsSync(`./data/company/${compCode}.json`)) {
                        try {
                            existingData = JSON.parse(fs.readFileSync(`./data/company/${compCode}.json`) || '{}');
                        } catch (e) {
                            console.log(e);
                            existingData = {};
                        }
                    }
                    delete stocksData.company;
                    existingData[date] = stocksData;
                    fs.writeFileSync(`./data/company/${compCode.replace(/\//g, '\u2215')}.json`, JSON.stringify(existingData));
                }
            }
        } catch (e) {
            console.log(e);
            continue;
        }

        console.log(date, "Grouping completed");
    }
}

module.exports = { scrapeData, groupByCompany };

