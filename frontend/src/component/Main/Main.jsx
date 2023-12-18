import React from "react";
import LineChart from "../Chart/LineChart";
import BarChart from "../Chart/BarChart";

import "./main.css";

export function Main() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="column">
            <h2>RSI</h2>
            <LineChart />
            {/* <p><</p> */}
          </div>
          <div className="column">
            <h2>Candle Stick</h2>
            <BarChart />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <h2>Column 3</h2>
            <BarChart />
            {/* <p>This is the content of the first column.</p> */}
          </div>
          <div className="column">
            <h2>Column 4</h2>
            <BarChart />
          </div>
        </div>
      </div>
    </>
  );
}
export default Main;
