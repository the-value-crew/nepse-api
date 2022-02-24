const { fetchListedCompanies, fetchDataOfDate } = require("./scrapper");
const { searchCompanyByName } = require("./helpers");

// fetchListedCompanies();
// console.log(searchCompanyByName("NIC Asia Bank"));
fetchDataOfDate("2014-01-05");