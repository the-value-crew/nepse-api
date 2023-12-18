import React from "react";
import LineChart from "../Chart/LineChart";
import BarChart from "../Chart/BarChart";

import "./main.css";

export function Main() {
  return (
    <>
      <div className="container">
        <div className="card">
          <div className="card-content">
            <div className="card-title">Card 1</div>
            <div className="card-text">
              <LineChart />
              {/* */}
            </div>
          </div>
        </div>

        <div className="card">
          {/* <img src="https://placekitten.com/201/150" alt="Card 2"> */}
          <div className="card-content">
            <div className="card-title">Card 2</div>
            <div className="card-text">
              {" "}
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Main;
