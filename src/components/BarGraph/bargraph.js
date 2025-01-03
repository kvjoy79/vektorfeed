import React, { useEffect, useRef } from "react";
import './bargraph.css';


const BarGraph = ({ yValues, labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"], width = "100%", height = "150px" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js";
    script.async = true;

    // Handle script loading error
    script.onerror = () => {
      console.error("Failed to load Chart.js library.");
    };

    script.onload = () => {
      // Check if the canvasRef is available
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");

        // Ensure Chart.js is available globally
        if (window.Chart) {
          new window.Chart(ctx, {
            type: "bar",
            data: {
              labels: labels, // Use dynamic X-axis labels passed as a prop
              datasets: [
                {
                  label: "Avg=Calculated Average ",
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "rgba(0,0,255,1.0)",
                  borderColor: "rgba(0,0,255,0.1)",
                  data: yValues, // Dynamic yValues
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false, // Hide grid lines on the x-axis
                    },
                    ticks: {
                      display: true, // Show x-axis ticks (labels)
                    },
                  },
                ],
                yAxes: [
                  {
                    gridLines: {
                      display: false, // Hide grid lines on the y-axis
                    },
                    ticks: {
                      display: false, // Hide y-axis labels (ticks)
                      beginAtZero: false, // Optionally start the y-axis at a minimum value if needed
                      max: 11, // Set the maximum value for the y-axis to 11
                    },
                  },
                ],
              },
              legend: { display: false }, // Remove the legend
            },
          });
        } else {
          console.error("Chart.js is not available.");
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [yValues, labels]); // Re-run if either yValues or labels changes

  return (
    <div className="bar-graph-container" style={{ width: width, height: height }}>
      {/* Use a ref to ensure the canvas is available */}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default BarGraph;
