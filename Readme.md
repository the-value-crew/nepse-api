# Overview

Nepse stocks data is scrapped daily from [Official Nepse Site](http://www.nepalstock.com/todaysprice) and saved as JSON files; which can be accessed via API calls.

## APIs

- `/data/info` : Brief info on APIs
- `/data/companies`: Listed companies on Nepse
- `/data/date/{{YYYY-MM-DD}}`: Daily stocks  info

## How does it work

It scrapes current week's data daily at 10:00 AM, 3:05 PM, and 12:00(midnight). Since both Nepse website and github action aren't very reliable scraping data multiple times a day seems good.