"use client";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Chart } from "@/types/chart";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface ChartsProps {
  jsonData: Chart;
}

const Charts: React.FC = ({jsonData}) => {
  if (!jsonData) {
    return <p>No data available</p>;
  }
  const [selectedInterval, setSelectedInterval] = useState<string>("day");

  let dataSales: number[] = [];
  let dataPurchase: number[] = [];
  let categoryDays: string[] = [];
  let categoryMonth: string[] = [];
  let maxNumber: number;
  if (selectedInterval === "day") {
    dataSales = jsonData.weekly_chart_sales.map((item) => item.sum);
    dataPurchase = jsonData.weekly_chart_purchase.map((item) => item.sum);
    categoryDays = jsonData.weekly_chart_sales.map((item)=> item.day);
  } else if (selectedInterval === "month") {
    dataSales = jsonData.monthly_chart_sales.map((item) => item.sum);
    dataPurchase = jsonData.monthly_chart_sales.map((item) => item.sum);
    categoryMonth = jsonData.weekly_chart_sales.map((item)=> item.month_str);
  }

  dataSales.forEach((currentNumber) => {
    if (maxNumber < currentNumber) {
      maxNumber = currentNumber;
    }
  });

  dataPurchase.forEach((currentNumber) => {
    if (maxNumber < currentNumber) {
      maxNumber = currentNumber;
    }
  });

  const [state, setState] = useState<ChartOneState>({
    series: [
      {name: "Sales", data: dataSales},
      {name: "Purchase", data: dataPurchase}
    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    if (interval === "day") {
      dataSales = jsonData.weekly_chart_sales.map((item) => item.sum);
      dataPurchase = jsonData.weekly_chart_purchase.map((item) => item.sum);
      categoryDays = jsonData.weekly_chart_sales.map((item)=> item.day);
    } else if (interval === "month") {
      dataSales = jsonData.monthly_chart_sales.map((item) => item.sum);
      dataPurchase = jsonData.monthly_chart_sales.map((item) => item.sum);
      categoryMonth = jsonData.weekly_chart_sales.map((item)=> item.month_str);
    }
    
    // You can add additional logic here if needed
  };

  const getDayLabels = () => {
    const daysOfWeek = categoryDays;
    return daysOfWeek;
  };

  const getMonthLabels = () => {
    const months = categoryMonth;
    return months
  }

  const getXAxisConfig = () => {
    if (selectedInterval === "day") {
      return {
        type: "category",
        categories: getDayLabels(),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      };
    } else {
      // Handle other intervals if needed
      return {
        type: "category",
        categories: getMonthLabels(),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      };
    }
  };

  const isWindowAvailable = () => typeof window !== "undefined";

  if (!isWindowAvailable()) return <></>;

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: getXAxisConfig(),
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: maxNumber,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h1>Weekly Chart</h1>
    <br></br>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Sales</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Purchase</p>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
              onClick={() => handleIntervalChange("day")}
            >
              Week
            </button>
            <button
              className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
              onClick={() => handleIntervalChange("month")}
            >
              Month
            </button>
          </div>
        </div> */}
      </div>

      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            width="95%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Charts;
