
fetch(`http://127.0.0.1:5000/api/v1.0/rainfall`)
    .then(res => res.json())
    .then(output => {
        var data = output;
        data.sort((a, b) => {
            return a.Year - b.Year;
        });

        var rainfall = data.map(data => data.Avg_Annual_Rainfall);
        var year = data.map(data => data.Year);
        var temp = data.map(data => data.Avg_Annual_Temp);
        console.log(year);
        console.log(rainfall);
        console.log(temp);
        console.log(data);

        function prepData1(data){
            var x = [];
            var y1 = [];
            var y2 = [];
            data.forEach(function(datum, i) {
                x.push(new Date(datum.Year));
                y1.push(datum.Avg_Annual_Rainfall/10);
                y2.push(datum.Avg_Annual_Temp);
            });
            return [{
                mode: 'lines+markers',
                marker: { size: 6 },
                x: x,
                y: y1,
                name: 'Rainfall (cm)',
                marker: {
                color: 'blue'}},
                {
                mode: 'lines+markers',
                marker: { size: 6 },
                x: x,
                y: y2,
                yaxis: 'y2',
                name: 'Temperature (Degrees Celcius)',
                marker: {color: 'red'}}
                ]};
        

        var data = prepData1(data)
        var layout = {
                plot_bgcolor:"grey",
                paper_bgcolor:"#FFF3",
                title:'Average Annual Rainfall(mm)/Temperature (Degrees celcius) Over Time' ,
                titlefont: {"size": 10} ,
                xaxis: {
                    rangeslider: {},
                    title: 'Year',
                    },
                yaxis: {
                    fixedrange: true,
                    title:'Rainfall(mm)',
                    titlefont: {color: 'blue'},
                    tickfont: {color: 'blue'},
                    },
                yaxis2: {
                    fixedrange: true,
                    title: 'Temperature (Degrees Celcius)',
                    titlefont: {color: 'red'},
                    tickfont: {color: 'red'},
                    overlaying: 'y',
                    side: 'right'
                    }, 
                legend: {
                        bgcolor: 'rgba(0,0,0,0)',
                        x: 0.4,
                        xanchor: 'right',
                        y: 1.2
                      }
                };

        // var data2 = prepData1(data2);
        // var layout2 = {
        //     title: 'Average Annual Temperature (Degrees Celcius) Over Time',
        //     xaxis: {
        //         rangeslider: {}
        //     },
        //     yaxis: {
        //         fixedrange: true
        //     }
        // };

        // var layout2 = {
        //     title: 'Average Annual Rrainfall(mm)/ Temperature (Degrees Celcius) Over Time',
        //     xaxis: {
        //         rangeslider: {}
        //     },
        //     yaxis: {
        //         fixedrange: true
        //     }
        // };
        var CHART = d3.selectAll("#graph").node();
        Plotly.newPlot(CHART, [data[0],data[1]], layout,{
            updatemenus: [{
                y: 0.8,
                yanchor: 'top',
                buttons: [{
                    method: 'restyle',
                    args: ['line.color', 'red'],
                    label: 'red'
                }, {
                    method: 'restyle',
                    args: ['line.color', 'blue'],
                    label: 'blue'
                }, {
                    method: 'restyle',
                    args: ['line.color', 'green'],
                    label: 'green'
                }]
            }, {
                y: 1,
                yanchor: 'top',
                buttons: [{
                    method: 'restyle',
                    args: ['visible', [true, false]],
                    label: 'rainfall'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, true]],
                    label: 'Temperature (°C)'
                }]
            }],
        });
        // d3.selectAll("body").on("change", updatePlotly);
        // function updatePlotly() {
        //     var dropdownMenu = d3.select("#selDataset");
        //     var dataset = dropdownMenu.node().value;
        //     var CHART = d3.selectAll("#graph").node();
        //     data = {};
        //     layout={};
        //     switch(dataset) {
        //         case "dataset1":
        //             data=data1;
        //             layout=layout1;
        //             break;
            
        //         case "dataset2":
        //             data=prepData2(data2);
        //             layout=layout2;
        //             break;
            
        //         case "dataset3":
        //             data=[prepData1(data1),prepData2(data2)];
        //             layout=layout3;  
        //             break;
            
        //         default:
        //             data=prepData1(data1)
        //             layout=layout1
        //             break;
        //         }
            
            
        //         // Note the extra brackets around 'x' and 'y'
        //         ;
        //         Plotly.restyle(CHART, data,layout);
        //         };
            
        });
    //   .then(function (response) {
    //       return response.text();
    //   }).then(function (text) {
    //       var Rainfall = text.Avg_Annual_Rainfall;
    //       var Year =text.Year;
    //       var Temp =text.Avg_Annual_Temp;
    //       console.log('GET response text:');
    //       console.log(text); 
    //   
      

