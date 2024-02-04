import { FC } from "react";
import ReactECharts from "echarts-for-react";

interface Props {
  data: {
    epoch: number;
    value: number;
  }[];
  title: string;
}

const BarChart: FC<Props> = ({ data, title }) => {
  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        color: "#333",
        fontWeight: "bold",
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => `Epoch ${item.epoch}`),
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data.map((item) => item.value),
        type: "bar",
        barWidth: "60%", // Adjust the bar width as needed
        itemStyle: {
          color: "#E8595C", // Bar color
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default BarChart;