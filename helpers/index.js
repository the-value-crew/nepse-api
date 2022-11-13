const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync("./data/companies.json"));
const moment = require("moment");

const searchCompanyByName = (keyword) => {
    try {
        if (!keyword) return [{ name: keyword, code: null, cat: null }];
        const results = [];
        for (const compCode in DATA)
            if (DATA[compCode].name.toLowerCase().includes(keyword.toLowerCase()))
                results.push({ code: compCode, ...DATA[compCode] });

        return results.length ? results : [{ name: keyword, code: null, cat: null }];
    } catch (e) {
        return [{ name: keyword, code: null, cat: null }];
    }
}

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
    if (day == 5) date = date.subtract(1, 'day');
    if (day == 6) date = date.subtract(2, 'day');

    return date.format("YYYY-MM-DD");
}

module.exports = { searchCompanyByName, allCompanies, lastMarketDay };