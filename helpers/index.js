const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync("./data/companies.json"));

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

module.exports = { searchCompanyByName };