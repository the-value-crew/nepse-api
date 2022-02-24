const axios = require('axios');
const fs = require("fs");
const { searchCompany } = require("./helpers");
const { JSDOM } = require("jsdom");
const moment = require("moment");

// const fetchLatestStockData = async () => {
//     try {
//         console.log("============= Latest stock data fetch initiated ============");
//         const { data } = await axios.get("http://www.nepalstock.com/todaysprice/export");
//         let jsonData = HtmlTableToJson.parse(data).results;
//         if (jsonData && jsonData.length) {
//             jsonData = jsonData[0];
//             let formatted = {};
//             for (let i = 0; i < jsonData.length; i++) {
//                 const d = jsonData[i];
//                 const companyCode = searchCompany(d["Traded Companies"]);

//                 formatted[companyCode] = {
//                     name: d["Traded Companies"],
//                     price: {
//                         min: d["Min Price"],
//                         max: d["Max Price"],
//                         closing: d["Closing Price"],
//                         prevClosing: d["Previous Closing"],
//                         diff: d["Difference Rs."],
//                     },
//                     numTrans: d["No. Of Transactions"],
//                     tradedShares: d["Traded Shares"],
//                 }
//             }
//             const fetchedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
//             fs.writeFileSync("./data/today.json", JSON.stringify({ data: formatted, fetchedAt }));
//             console.log("============= Latest stock data fetch completed", fetchedAt, "============");
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

const fetchListedCompanies = async () => {
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
    console.log(companies);
}

const fetchDataOfDate = async (date) => {
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

        let stockData = [
            ["S.N.",
                "Traded Companies",
                "No. Of Transaction",
                "Max Price",
                "Min Price",
                "Closing Price",
                "Traded Shares",
                "Amount",
                "Previous Closing",
                "Difference Rs."]
        ];
        let metadata = [];

        arr.forEach((a, i) => {
            let data = a.textContent.trim().split("\n").filter(e => e && e.length > 1).map(e => {
                let d = e.trim();
                d = d.replace(/,/g, '');
                if (!isNaN(d)) d = parseFloat(d);
                return d;
            });

            // last 3 is metadata
            if (arr.length - i > 3) stockData.push(data);
            else metadata.push(data);
        })

        fs.writeFileSync(`./data/date/${date}.json`, JSON.stringify({ metadata, data: stockData }));
    } catch (e) {
        console.log(e);
    }
}

const runCron = async () => {
    let start = moment('2015-06-21', 'YYYY-MM-DD');
    let days = moment().diff(start, 'days');
    for (let i = 0; i < days; i++) {
        start.add(1, 'days');
        let date = start.format('YYYY-MM-DD')
        await fetchDataOfDate(date);
        console.log(date, "Done");
    }
}

module.exports = { fetchListedCompanies, fetchDataOfDate, runCron };

