import { useEffect, useState } from 'react'
import moment from 'moment'
import Card from "./Card"
import axios from "axios"
import LineChart from "./LineChart"

type Company = {
  id: string
  name: string
}

type Companies = {
  [key: string]: Company
}

type StockData = {
  date: string
  price: number
}

function App() {
  const [activeCompany, setActiveCompany] = useState<string>()
  const [companies, setCompanies] = useState<Companies>()
  const [stocksData, setStocksData] = useState<StockData[]>()

  useEffect(() => {
    axios.get("https://the-value-crew.github.io/nepse-api/data/companies.json")
      .then(resp => {
        setCompanies(resp.data);
        setActiveCompany(Object.keys(resp.data).shift())
      })
      .catch(e => console.log(e))
  }, [])

  useEffect(() => {
    axios.get(`https://the-value-crew.github.io/nepse-api/data/company/${activeCompany}.json`)
      .then(resp => {
        let data = Object.entries(resp.data).map(([date, value]) => {
          return { date, price: (value as any).price.close };
        }).slice(-30)
        setStocksData(data)
      })
      .catch(e => console.log(e))
  }, [activeCompany])




  return (
    <div className="App">

      <div className="container mx-auto">

        {/* Header */}
        <div className="text-center my-16">
          <h1 className='text-5xl mb-8 font-semibold text-gray-800 font-Montserrat'>Nepse API</h1>
          <p className='text-3xl text-gray-700 font-Lato'>Demo application developed to illustrate &nbsp;
            <a href="https://github.com/the-value-crew/nepse-api" target="_blank" rel="noopener noreferrer" className='underline text-blue-500 italic'>nepse-api </a>
          </p>
        </div>

        {/* Data */}
        <div className="flex w-100">

          {/* Companies */}
          <Card className="w-96">
            <div>
              <p className='text-2xl text-gray-800 mb-8'>🏢 Listed companies</p>

              <ul className='h-96 overflow-auto'>
                {companies && Object.entries(companies).map(([compCode, company]) => {
                  return <li
                    key={compCode}
                    className="my-2 p-2 mr-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => setActiveCompany(compCode)}>
                    {company.name}
                  </li>
                })}
              </ul>

            </div>
          </Card>

          {/* Latest stocks price */}
          <Card className="flex-grow">
            {activeCompany && companies &&
              <>
                <div>
                  <p className='text-2xl text-gray-800'>{companies[activeCompany].name}</p>
                </div>

                {stocksData && <LineChart data={stocksData} />}
              </>
            }
          </Card>
        </div>

      </div>





    </div>
  )
}

export default App
