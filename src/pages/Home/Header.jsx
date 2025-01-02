import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2"; // Import Pie chart instead of Bar chart
import {
  Chart as ChartJS,
  ArcElement, // Required for Pie chart
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";

// Register necessary components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const Header = () => {
  const [data, setData] = useState({
    labels: ["Books", "Clients"], // Labels for pie sections
    datasets: [
      {
        label: "Count",
        data: [0, 0], // Default data, will be updated after fetching
        backgroundColor: [
          "rgb(166, 174, 191)", // Color for Books
          "rgb(49, 81, 30)", // Color for Clients
        ],
        borderColor: [
          "rgb(166, 174, 191)", // Border color for Books
          "rgb(49, 81, 30)", // Border color for Clients
        ],
        borderWidth: 1,
      },
    ],
  });

  const API_BOOKS_URL =
   `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`;
  const API_CLIENTS_URL =
    `${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`;
  const isFetched = useRef(false); // Prevent multiple API calls

  // Fetch books count
  const fetchBooks = async () => {
    try {
      const booksResponse = await axios.get(API_BOOKS_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Extract the count of books
      const booksCount = booksResponse.data?.books?.length || 0;
      return booksCount;
    } catch (error) {
      toast.error("Error fetching books");
      console.error("Error fetching books:", error);
      return 0; // Return 0 in case of an error
    }
  };

  // Fetch clients count
  const fetchClients = async () => {
    try {
      const clientsResponse = await axios.get(API_CLIENTS_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Extract the count of clients
      const clientsCount = clientsResponse.data?.data?.length || 0;
      return clientsCount;
    } catch (error) {
      toast.error("Error fetching clients");
      console.error("Error fetching clients:", error);
      return 0; // Return 0 in case of an error
    }
  };

  // Fetch and update chart data
  const fetchData = async () => {
    if (isFetched.current) return; // Skip if already fetched
    isFetched.current = true;

    try {
      const booksCount = await fetchBooks();
      const clientsCount = await fetchClients();

      // Update chart data
      setData((prevState) => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: [booksCount, clientsCount],
          },
        ],
      }));
    } catch (error) {
      toast.error("Error fetching data");
      console.error("Error fetching books or clients:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="d-flex" style={{ "padding-left": "8rem" }}>
      <div className="container mt-4">
        <div
          className="chart-container"
          style={{
            position: "relative", // Ensure canvas is positioned behind the chart
            maxWidth: "400px", // Adjust chart size
            margin: "0 auto",
          }}
        >
          {/* Canvas background */}
          <canvas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1, // Ensure canvas is behind the chart
              width: "100%",
              height: "100%",
            }}
          ></canvas>

          <Pie
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top", // Adjust legend position if needed
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      // Custom label for the tooltips if needed
                      return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                  },
                },
              },
            }}
            width={400}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
