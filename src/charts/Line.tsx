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

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

const handleResize = (chart: any) => {
  chart.resize();
};

function LineChart({
  current,
  previous,
  labels,
}: {
  current: number[];
  previous: number[];
  labels: string[];
}) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Current Month",
        data: current,
        fill: false,
        backgroundColor: "#E36B37",
        borderColor: "#E36B37",
        borderWidth: 1,
        tension: 0.6,
      },
      {
        label: "Previous Month",
        data: previous,
        fill: false,
        backgroundColor: "#F94144",
        borderColor: "#F94144",
        borderWidth: 1,
        tension: 0.6,
      },
    ],
  };
  const options = {
    responsive: true,
    onResize: handleResize,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: true,
        },
      },
    },
  };
  return <Line data={data} options={options} />;
}

export default LineChart;
