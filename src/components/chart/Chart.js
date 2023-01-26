import React from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import "./Chart.scss";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
export const LineChartExample = ({ data, legend }) => {
  return (
    <Line
      className="line-chart"
      data={data}
      options={{
        legend: {
          display: legend,
          labels: {
            boxWidth: 12,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 10,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export const BarChartExample = ({ data, stacked , className }) => {
  return (
    <Bar
    className={`BarChartExample ${className}`}

      data={data}
      options={{
        plugins: {
            legend: {
            display:false
            },
            tooltips: {
                backgroundColor:"red",
                titleFont:143,
                bodyColor:"#FFF",
                     yAlign: 10,
                xAlign: 10,
                // enabled: true,
                // backgroundColor: "#eff6ff",
                // titleFontSize: 13,
                // titleFontColor: "#6783b8",
                // titleMarginBottom: 6,
                // bodyFontColor: "#9eaecf",
                // bodyFontSize: 12,
                // bodySpacing: 4,
                // yPadding: 10,
                // xPadding: 10,
                // footerMarginTop: 0,
                // displayColors: false, 
              },
          },
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        maintainAspectRatio: false,
        
        scales: {
            x: {
              grid: {
                display: false,
                drawBorder: true,
                drawOnChartArea: true,
                drawTicks: true,
              }
            },
            y: {
              grid: {
                drawBorder: false,
                color: function(context) {
                  if (context.tick.value > 0) {
                    return "#bfbfbf4a";
                  } else if (context.tick.value < 0) {
                    return "red";
                  }
      
                  return '#FFF';
                },
              },
            }
          }
        // scales: {
        //   yAxes: [
        //     // {
        //     //   display: true,
        //     //   stacked: stacked ? true : false,
        //     //   ticks: {
        //     //     beginAtZero: true,
        //     //     fontSize: 12,
        //     //     fontColor: "#9eaecf",
        //     //     padding: 5,
        //     //   },
        //     //   gridLines: {
        //     //     tickMarkLength: 2,
        //     //     color: "red"
        //     //   },
        //     //   grid:{
        //     //       color:"red"
        //     //   }
        //     // },
        //   ],
        //   xAxes: [
        //       {
        //           display:false
        //       }
        //     // {
        //     //   display: true,
        //     //   stacked: stacked ? true : false,
        //     //   ticks: {
        //     //     fontSize: 12,
        //     //     fontColor: "#9eaecf",
        //     //     source: "auto",
        //     //     padding: 5,
        //     //   },
        //     //   gridLines: {
        //     //     color: "transparent",
        //     //     tickMarkLength: 10,
        //     //     zeroLineColor: "transparent",
        //     //   },
        //     // },
        //   ],
        // },
      }}
    />
  );
};

export const PieChartExample = ({ data }) => {
  return (
    <Pie
      data={data}
      options={{
        legend: {
          display: false,
        },
        rotation: -0.2,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
      }}
    />
  );
};

export const DoughnutExample = ({ data }) => {
  return (
    <Doughnut
      data={data}
      options={{
        legend: {
          display: false,
        },
        rotation: 1,
        cutoutPercentage: 40,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
      }}
    />
  );
};

// export const PolarExample = ({ data }) => {
//   return (
//     <Polar
//       data={data}
//       options={{
//         legend: {
//           display: false,
//         },
//         maintainAspectRatio: false,
//         tooltips: {
//           enabled: true,
//           backgroundColor: "#eff6ff",
//           titleFontSize: 13,
//           titleFontColor: "#6783b8",
//           titleMarginBottom: 6,
//           bodyFontColor: "#9eaecf",
//           bodyFontSize: 12,
//           bodySpacing: 4,
//           yPadding: 10,
//           xPadding: 10,
//           footerMarginTop: 0,
//           displayColors: false,
//         },
//       }}
//     />
//   );
// };
