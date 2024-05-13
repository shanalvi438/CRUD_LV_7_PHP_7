'use strict';

let daBarChartConfig = {
    name: "Pending Payment",
    color: '#fbb02a',
    data: [],
    type: 'bar',
    barGap: 0,
    smooth: true,
    itemStyle: {
        emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: -2,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
    }
};

let idBarChartConfig = {
    name: "Paid",
    color: '#cfff7b',
    data: [],
    type: 'bar',
    barGap: 0,
    smooth: true,
    itemStyle: {
        emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: -2,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
    }
};

let paBarChartConfig = {
    name: "Completed",
    color: '#2df400',
    data: [],
    type: 'bar',
    barGap: 0,
    smooth: true,
    itemStyle: {
        emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: -2,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
    }
};

let pcBarChartConfig = {
    name: "Canceled",
    color: '#f80303',
    data: [],
    type: 'bar',
    barGap: 0,
    smooth: true,
    itemStyle: {
        emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: -2,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
    }
};

$(document).ready(async function () {

//     await ajaxRequest2('/admin/fetch-bar-chart-data', 'post', null, false).then(res => {
//         let id = [], da = [], pa = [], pc = [];

//         res.forEach(v => { id.push(v.id); da.push(v.da); pa.push(v.pa); pc.push(v.pc); });

//         idBarChartConfig.data = id; daBarChartConfig.data = da; paBarChartConfig.data = pa; pcBarChartConfig.data = pc;

//         let series = [
//             idBarChartConfig, daBarChartConfig, paBarChartConfig, pcBarChartConfig
//         ];

// // Bar Chart
//         let eChartElemBar = document.getElementById('echartBar');
//         if (eChartElemBar) {
//             let eChartBar = echarts.init(eChartElemBar);
//             eChartBar.setOption({
//                 legend: {
//                     borderRadius: 0,
//                     orient: 'horizontal',
//                     x: 'right',
//                     data: ['Pending Payment', 'Awaiting Delivery', 'Completed', 'Canceled']
//                 },
//                 grid: {
//                     left: '8px',
//                     right: '8px',
//                     bottom: '0',
//                     containLabel: true
//                 },
//                 tooltip: {
//                     show: true,
//                     backgroundColor: 'rgba(0, 0, 0, .8)'
//                 },
//                 xAxis: [{
//                     type: 'category',
//                     data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
//                     axisTick: {
//                         alignWithLabel: true
//                     },
//                     splitLine: {
//                         show: false
//                     },
//                     axisLine: {
//                         show: true
//                     }
//                 }],
//                 yAxis: [{
//                     type: 'value',
//                     axisLabel: {
//                         formatter: function (value) {
//                             return value;
//                         }
//                     },
//                     min: 0,
//                     axisLine: {
//                         show: false
//                     },
//                     splitLine: {
//                         show: true,
//                         interval: 'auto'
//                     }
//                 }],

//                 series: series
//             });

//             $(window).on('resize', function () {
//                 setTimeout(function () {
//                     eChartBar.resize();
//                 }, 500);
//             });
//         }
//     });

    await ajaxRequest2('/fetch-pie-chart-data', 'post', null, false).then(res => {
        console.log(res);
        let eChartElemPie = document.getElementById('echartPie1');
        if (eChartElemPie) {
            let eChartPie = echarts.init(eChartElemPie);
            eChartPie.setOption({
                color: [
                    '#ba1212',
                    '#1646be',
                    '#14a2c6',
                    '#c8b517',
                    '#4a1bc6',
                    '#5abe1c',
                    '#1bb15e',
                    '#3313c1',
                    '#6f17c1',
                    '#a7c616',
                    '#c44f17',
                    '#c61684'],
                tooltip: {
                    show: true,
                    backgroundColor: 'rgba(0, 0, 0, .8)'
                },

                series: [{
                    name: 'Lessons',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: res,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            });
            $(window).on('resize', function () {
                setTimeout(function () {
                    eChartPie.resize();
                }, 500);
            });
        }
    });
})
