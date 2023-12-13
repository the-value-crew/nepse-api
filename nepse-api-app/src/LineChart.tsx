import React from "react";
import { Chart, AxisOptions } from "react-charts";

type Props = {
  data: any;
};

type DailyData = {
  date: Date;
  price: number;
};

type Series = {
  label: string;
  data: DailyData[];
};

const LineChart = ({ data }: Props) => {
  console.log(data, "this line chart");

  const primaryAxis = React.useMemo(
    (): AxisOptions<DailyData> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<DailyData>[] => [
      {
        getValue: (datum) => datum.price,
      },
    ],
    []
  );

  const chartData: Series[] = [{ label: "React Charts", data }];
  console.log(chartData, "chartdata");

  return (
    <>
      <Chart
        options={{
          data: chartData,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </>
  );
};

export default LineChart;
