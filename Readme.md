# Overview

This repository contains Nepse stocks data scrapped daily from [Official Nepse Site](https://nepalstock.com/) and saved as JSON files; which can be accessed via API calls.

## API endpoints

- `/data/info` : Brief info on APIs
- `/data/companies`: Listed companies on Nepse
- `/data/date/{{YYYY-MM-DD}}`: Daily stocks data by date
- `/data/date/latest`: Latest data by date
- `/data/company/{{company-code}}`: Daily data by company code

## Examples

### [/data/info.json](https://the-value-crew.github.io/nepse-api/data/info.json)
```json
{
    "Name": "Nepse daily data API",
    "lastUpdatedAt": "2022-02-25 13:11:21"
}
```

### [/data/companies.json](https://the-value-crew.github.io/nepse-api/data/companies.json)
```json
{
    "NMBD2085": {
        "name": "10 % NMB DEBENTURE 2085",
        "cat": "Corporate Debenture"
    },
    "HBLD83": {
        "name": "10% Himalayan Bank Debenture 2083",
        "cat": "Corporate Debenture"
    },
    "LBLD86": {
        "name": "10% Laxmi Bank Debenture 2086",
        "cat": "Corporate Debenture"
    },
    "NBLD82": {
        "name": "10% Nabil Debenture 2082",
        "cat": "Corporate Debenture"
    }
}
```
### [/data/date/latest.json](https://the-value-crew.github.io/nepse-api/data/date/latest.json)
```json
{
    "metadata": {
        "totalAmt": 4293864192,
        "totalQty": 8490689,
        "totalTrans": 65011
    },
    "data": [
        {
            "company": {
                "code": "NBLD82",
                "name": "10% Nabil Debenture 2082",
                "cat": "Corporate Debenture"
            },
            "price": {
                "max": 932.2,
                "min": 932.2,
                "close": 932.2,
                "prevClose": 950.6,
                "diff": -18.4
            },
            "numTrans": 1,
            "tradedShares": 25,
            "amount": 23305
        }
    ]
}
```

## How does it work

Nepse operates Sunday to Thursday, from 11:00 AM - 3:00 PM. Each day last 7 days' data is scraped at 10:00 AM, 3:05 PM, and 12:00(midnight). Since Nepse's server crashes frequently, scraping last 7 days' data till today, multiple times a day, seems good approach.

## Todos
- [ ] Split large JSON files into smaller chunks for lighter API response
- [ ] Improve landing page

## Nepse-api is used by

- [Samaya](https://bibhuticoder.github.io/samaya/): friendly personal dashboard on browser's new tab

## Contribution
We are open to any kind of suggestions and improvements. Please feel free to contribute by any means possible 😀
