import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the necessary Chart.js components
ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

// Function to handle chart resizing
const handleResize = (chart: any) => {
  chart.resize();
};

// LineChart component adjusted to take 'data' prop instead of 'current' and 'previous'
function LineChart({
  labels,
  data,
  activeMonth,
}: {
  labels: string[]; // X-axis labels
  data: number[]; // Data to display (either current or previous month)
  activeMonth: string;
}) {
  // Data structure for the chart
  const chartData = {
    labels: labels, // X-axis labels
    datasets: [
      {
        label: "Monthly Data", // Generic label as the data could be for current or previous month
        data: data, // Data passed from the parent component (current or previous)
        fill: false, // No fill under the line
        backgroundColor: activeMonth === "current" ? "#E36B37" : "#F94144", // Color for points
        borderColor: activeMonth === "current" ? "#E36B37" : "#F94144", // Line color
        borderWidth: 2, // Line thickness
        pointRadius: 3, // Size of points
        tension: 0.4, // Curve smoothness
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true, // Ensure the chart adjusts to container size
    onResize: handleResize, // Handle chart resizing
    maintainAspectRatio: false, // Allow full use of the container space
    plugins: {
      legend: {
        display: false, // Hide the legend as the dataset label is generic
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y.toFixed(2)}`; // Tooltip formatting
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          display: true, // Display gridlines on the Y-axis
        },
        ticks: {
          beginAtZero: true, // Ensure the Y-axis starts at zero
          callback: function (tickValue: string | number) {
            if (typeof tickValue === "number") {
              return tickValue.toLocaleString(); // Format values with commas
            }
            return tickValue;
          },
        },
      },
      x: {
        grid: {
          display: true, // Display gridlines on the X-axis
        },
        // ticks: {
        //   autoSkip: true, // Skip ticks if there are too many
        //   maxTicksLimit: 7, // Limit the number of X-axis ticks
        // },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
