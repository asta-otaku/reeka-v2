import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      // display: false,
      beginAtZero: true,
    },
    y: {
      border: {
        display: false,
        dash: [16, 12],
      },
    },
  },
};

const getGradient = (chart: any, color: string) => {
  const { ctx, chartArea } = chart;
  if (!chartArea) {
    return null;
  }
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom
  );
  gradient.addColorStop(0.1, color + "80");
  gradient.addColorStop(1, color + "00");
  return gradient;
};

export default function AreaChart({
  values,
  color,
  tension,
  label,
}: {
  values: number[];
  color: string;
  tension: number;
  label: string;
}) {
  return (
    <Line
      options={options}
      data={{
        labels: ["Dec 4", "Dec 25", "Jan 4"],
        datasets: [
          {
            label,
            data: values,
            fill: true,
            backgroundColor: (context: any) => {
              const chart = context.chart;
              const { chartArea } = chart;
              if (!chartArea) {
                return null;
              }
              return getGradient(chart, color);
            },
            borderColor: color,
            tension,
          },
        ],
      }}
    />
  );
}
