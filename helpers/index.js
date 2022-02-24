const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync("./data/companies.json"));

const searchCompanyByName = (keyword) => {
    const results = [];
    for (const compCode in DATA)
        if (DATA[compCode].name.toLowerCase().includes(keyword.toLowerCase()))
            results.push({ code: compCode, ...DATA[compCode] });

    return results;
}

module.exports = { searchCompanyByName };