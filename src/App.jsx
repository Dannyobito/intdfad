import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import TrafficChart from "./components/TrafficChart";
import "./App.css";

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const increaseCurrentPage = () => {
    setCurrentPage(currentPage + 1);
    console.log(currentPage);
  };
  setTimeout(increaseCurrentPage, 1000);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/test_data_w_timeframe.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);

        const parsedData = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
        });
        console.log("Parsed CSV Data:", parsedData);

        const formattedData = parsedData.data.map((row) => ({
          time: new Date(row.Timestamp),
          "Average Packet Size": row["Average Packet Size"],
          "Total Length of Fwd Packets": row["Total Length of Fwd Packets"],
          "Subflow Fwd Bytes": row["Subflow Fwd Bytes"],
          "Packet Length Mean": row["Packet Length Mean"],
          "Avg Fwd Segment Size": row["Avg Fwd Segment Size"],
          "Fwd Packet Length Max": row["Fwd Packet Length Max"],
          "Fwd Packet Length Mean": row["Fwd Packet Length Mean"],
          "Packet Length Variance": row["Packet Length Variance"],
          "Packet Length Std": row["Packet Length Std"],
          "Max Packet Length": row["Max Packet Length"],
          label: row.Label,
        }));

        setChartData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the CSV file:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = [
    "Average Packet Size",
    "Total Length of Fwd Packets",
    "Subflow Fwd Bytes",
    "Packet Length Mean",
    "Avg Fwd Segment Size",
    "Fwd Packet Length Max",
    "Fwd Packet Length Mean",
    "Packet Length Variance",
    "Packet Length Std",
    "Max Packet Length",
  ];
  const paginatedData = chartData.slice(
    (currentPage - 1) * 60,
    currentPage * 60
  );
  return (
    <div className="App">
      <h1>Network Traffic Visualization</h1>
      <button onClick={increaseCurrentPage}>Click here to change page</button>
      {isLoading ? (
        <p>Loading data...</p>
      ) : chartData.length > 0 ? (
        <div className="chart-container">
          {metrics.map((metric) => (
            <div key={metric} className="chart-item">
              <TrafficChart
                data={paginatedData}
                metric={metric}
                label={metric}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default App;

// import { useState, useEffect } from "react";
// import LineGraph from "./components/Line";
// import Papa from "papaparse";
// import axios from "axios";
// import "./App.css";
// import TrafficChart from "./components/TrafficChart";

// function App() {
//   const [chartData, setChartData] = useState([]);
//   // useEffect(() => {
//   //   const fetchPredictions = async () => {
//   //     const res = await axios.get("http://localhost:5000/predict");
//   //     const jsonData = res.data;
//   //     const dataFinal = jsonData["success"];
//   //     console.log(dataFinal);
//   //     setChartData(dataFinal);
//   //     console.log(typeof dataFinal);
//   //     // const {
//   //     //   Average_Packet_Size,
//   //     //   Total_Length_of_Fwd_Packets,
//   //     //   Subflow_Fwd_Bytes,
//   //     //   Packet_Length_Mean,
//   //     //   Avg_Fwd_Segment_Size,
//   //     //   Fwd_Packet_Length_Max,
//   //     //   Fwd_Packet_Length_Mean,
//   //     //   Packet_Length_Variance,
//   //     //   Packet_Length_Std,
//   //     //   Max_Packet_Length,
//   //     //   Label,
//   //     //   Timestamp,
//   //     // } = {
//   //     //   Average_Packet_Size: dataFinal["Average Packet Size"],
//   //     //   Total_Length_of_Fwd_Packets: dataFinal["Total Length of Fwd Packets"],
//   //     //   Subflow_Fwd_Bytes: dataFinal["Subflow Fwd Bytes"],
//   //     //   Packet_Length_Mean: dataFinal["Packet Length Mean"],
//   //     //   Avg_Fwd_Segment_Size: dataFinal["Avg Fwd Segment Size"],
//   //     //   Fwd_Packet_Length_Max: dataFinal["Fwd Packet Length Max"],
//   //     //   Fwd_Packet_Length_Mean: dataFinal["Fwd Packet Length Mean"],
//   //     //   Packet_Length_Variance: dataFinal["Packet Length Variance"],
//   //     //   Packet_Length_Std: dataFinal["Packet Length Std"],
//   //     //   Max_Packet_Length: dataFinal["Max Packet Length"],
//   //     //   Label: dataFinal["Label"],
//   //     //   Timestamp: dataFinal["Timestamp"],
//   //     // };
//   //     // console.log(
//   //     //   Average_Packet_Size,
//   //     //   Total_Length_of_Fwd_Packets,
//   //     //   Subflow_Fwd_Bytes,
//   //     //   Packet_Length_Mean,
//   //     //   Avg_Fwd_Segment_Size,
//   //     //   Fwd_Packet_Length_Max,
//   //     //   Fwd_Packet_Length_Mean,
//   //     //   Packet_Length_Variance,
//   //     //   Packet_Length_Std,
//   //     //   Max_Packet_Length,
//   //     //   Label,
//   //     //   Timestamp
//   //     // );
//   //   };
//   //   fetchPredictions();
//   // }, []);
//   // const {
//   //   Average_Packet_Size,
//   //   Total_Length_of_Fwd_Packets,
//   //   Subflow_Fwd_Bytes,
//   //   Packet_Length_Mean,
//   //   Avg_Fwd_Segment_Size,
//   //   Fwd_Packet_Length_Max,
//   //   Fwd_Packet_Length_Mean,
//   //   Packet_Length_Variance,
//   //   Packet_Length_Std,
//   //   Max_Packet_Length,
//   //   Label,
//   //   Timestamp,
//   // } = {
//   //   Average_Packet_Size: chartData["Average Packet Size"],
//   //   Total_Length_of_Fwd_Packets: chartData["Total Length of Fwd Packets"],
//   //   Subflow_Fwd_Bytes: chartData["Subflow Fwd Bytes"],
//   //   Packet_Length_Mean: chartData["Packet Length Mean"],
//   //   Avg_Fwd_Segment_Size: chartData["Avg Fwd Segment Size"],
//   //   Fwd_Packet_Length_Max: chartData["Fwd Packet Length Max"],
//   //   Fwd_Packet_Length_Mean: chartData["Fwd Packet Length Mean"],
//   //   Packet_Length_Variance: chartData["Packet Length Variance"],
//   //   Packet_Length_Std: chartData["Packet Length Std"],
//   //   Max_Packet_Length: chartData["Max Packet Length"],
//   //   Label: chartData["Label"],
//   //   Timestamp: chartData["Timestamp"],
//   // };
//   // console.log(
//   //   Average_Packet_Size,
//   //   Total_Length_of_Fwd_Packets,
//   //   Subflow_Fwd_Bytes,
//   //   Packet_Length_Mean,
//   //   Avg_Fwd_Segment_Size,
//   //   Fwd_Packet_Length_Max,
//   //   Fwd_Packet_Length_Mean,
//   //   Packet_Length_Variance,
//   //   Packet_Length_Std,
//   //   Max_Packet_Length,
//   //   Label,
//   //   Timestamp
//   // );
//   useEffect(() => {
//     // Load the CSV file
//     const fetchData = async () => {
//       const response = await fetch("./test_data_w_timeframe.csv");
//       const reader = response.body.getReader();
//       const result = await reader.read(); // raw array
//       const decoder = new TextDecoder("utf-8");
//       const csv = decoder.decode(result.value); // the csv text
//       const parsedData = Papa.parse(csv, { header: true, dynamicTyping: true });
//       const formattedData = parsedData.data.map((row) => ({
//         time: new Date(row.Timestamp),
//         value: row["Average Packet Size"], // Example: Adjust according to your needs
//         label: row.Label,
//       }));
//       console.log(formattedData);
//       setChartData(formattedData);
//     };

//     fetchData();
//   }, []);
//   return (
//     <>
//       <div>
//         rasengan
//         <div className="App">
//           <h1>Network Traffic Visualization</h1>
//           {chartData.length > 0 ? (
//             <TrafficChart data={chartData.slice(100, 200)} />
//           ) : (
//             <p>No data available</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;
