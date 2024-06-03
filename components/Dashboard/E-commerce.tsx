"use client";
import React, { useEffect, useState } from "react";
// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import { Chart } from "@/types/chart";
import Charts from "../Charts/Charts";
import ChartMonth from "../Charts/ChartsMonth";

const ECommerce: React.FC = () => {
  const [data, setData] = useState<Chart | null>(null);
  const [isLoading, setLoading] = useState(true);

  const refreshTable = async () => {
    fetch(`http://localhost:7000/api/v1/chart`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData && responseData.data) {
          const charts: Chart = responseData.data;
          setData(charts);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }
  useEffect(() => {
    refreshTable();
  }, []);

  return (
    <>  <Charts jsonData={data} />

        <ChartMonth jsonData={data} />
    </>
  );
};

export default ECommerce;
