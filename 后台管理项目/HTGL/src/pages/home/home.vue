<template>
  <div>
    <div id="box"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    var myChart = echarts.init(document.getElementById('box'));
    var option = {
      title: {
        text: "近一周订单数量",
      },
      tooltip: {},
      legend: {
        data: ["近一周订单数量"],
      },
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六","周日"],
      },
      yAxis: {},
      series: [
        {
          name: "近一周订单数量",
          type: "line",
          data: [300, 320, 160, 480, 390,700, 810],
        },
      ],
    };
    myChart.setOption(option);
  },
};
</script>

<style>
#box {
  width: 1000px;
  height: 400px;
  margin: 30px auto;
}
</style>