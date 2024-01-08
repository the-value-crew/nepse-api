import React, { useEffect, useState } from "react";
import Navbar from "./component/Navbar/Navbar";
import Main from "./component/Main/Main";
import Footer from "./component/Footer/Footer";
import axios from "axios";
import "./App.css";

export function App() {
  const [activeCompany, setActiveCompany] = useState();
  const [companies, setCompanies] = useState();
  const [stocksData, setStocksData] = useState();

  useEffect(() => {
    axios
      .get("https://the-value-crew.github.io/nepse-api/data/companies.json")
      .then((resp) => {
        setCompanies(resp.data);
        setActiveCompany(Object.keys(resp.data).shift());
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeCompany) {
          // Dynamically import the JSON file
          const { default: jsonData } = await import(
            `../../data/company/${activeCompany}.json`
          );

          // Process the data
          let data = Object.entries(jsonData)
            .map(([date, value]) => ({
              date,
              price: value.price.close,
            }))
            .slice(-20);

          setStocksData(data);
        }
      } catch (error) {
        console.error(`Error loading JSON data: ${error}`);
      }
    };

    fetchData();
  }, [activeCompany]);
  console.log(activeCompany, "this is json dta");

  return (
    <div className="main-container">
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
}
export default App;
