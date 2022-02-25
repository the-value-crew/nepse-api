# Overview

This repository contains Nepse stocks data scrapped daily from [Official Nepse Site](http://www.nepalstock.com/todaysprice) and saved as JSON files; which can be accessed via API calls.

## API endpoints

- `/data/info` : Brief info on APIs
- `/data/companies`: Listed companies on Nepse
- `/data/date/{{YYYY-MM-DD}}`: Daily stocks data by date
- `/data/date/latest`: Latest data by date
- `/data/company/{{company-code}}`: Daily data by company code

## How does it work

Nepse operates Sunday to Thursday, from 11:00 AM - 3:00 PM. Each day last 7 days' date is scraped at 10:00 AM, 3:05 PM, and 12:00(midnight). Since Nepse's server crashes frequently, scraping last 7 days' data till today; multiple times a day; seems good approach.