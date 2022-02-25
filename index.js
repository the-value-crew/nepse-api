const { fetchListedCompanies, fetchDataOfDate, runCron } = require("./scrapper");
const { searchCompanyByName } = require("./helpers");

// fetchListedCompanies();
// console.log(searchCompanyByName("NIC Asia Bank"));
// fetchDataOfDate("2010-03-02");
runCron();