const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync("./data/companies.json"));

const searchCompanyByName = (keyword) => {
    try {
        if (!keyword) return null;
        const results = [];
        for (const compCode in DATA)
            if (DATA[compCode].name.toLowerCase().includes(keyword.toLowerCase()))
                results.push({ code: compCode, ...DATA[compCode] });

        return results.length ? results : null;
    } catch (e) {
        return null;
    }
}

module.exports = { searchCompanyByName };