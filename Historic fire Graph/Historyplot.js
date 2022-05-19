let transitionTime = 2000
fetch(`http://127.0.0.1:5000/api/v1.0/fireWAhistorical`)
    .then(res => res.json())
    .then(output => {
        var data = output
        graph(data)
        setup(data)
        update(data)});

let Districtfulllist = {
            WTN:'Wellington',
            DON:'Donnelly',
            BWD:'Blackwood',
            PIL:'Pilbara',
            GLD:'Goldfields-Prescibed',
            MOR:'Moora',
            SWC:'Swan Coastal',
            PHS:'Perth Hills',
            ALB:'Albany',
            WKM:'West Kimberley',
            EKM:'East Kimberley',
            ESP:'Esperance',
            GER:'Geraldton',
            FRK:'Frankland',
            EXM:'Exmouth',
            SHB:'Shark Bay',
            KAL:'Goldfields-bushfire',
            WHB:'Wheatbelt'}
//Define SVG area dimensions
var svgWidth = 600;
var svgHeight = 400;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 50
    };

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
function graph(data){
    d3.require('d3').then(d3 =>{
        var Districtsdata = Array.from(d3.group(data, d => d.District ,  d => d.Year, d=>d.Type), ([key, value]) => ({key, value}));
        // const yearlydistrictdata = d3.group(Districtsdata, d=>d.Year);
        console.log(Districtsdata)
        var Districts = Object.values(Districtsdata)
        console.log(Districts)
        var districts = Districtsdata.map(function(element){
            // console.log(element.key);
            return element.key;

        }, this);

        var Yearsarrays = Districtsdata.map(function(element){
            // console.log(element.key);
            return element.value;

        }, this);


        var districtindex =districts.indexOf("PHL")
        console.log(districtindex)
        let districtdata = Yearsarrays[districtindex]
        console.log(districtdata)

        let y = Yearsarrays[districtindex]

        const arrays=[]; 
        y.forEach((value, key) => {
            console.log(value, key)
            arrays.push(value)
            return key;
        },this);



        let allgraphdata= arrays[0]
        const wf = [];
        const pb = [];
        const Unknown=[];
        allgraphdata.forEach((value, key) => {
            console.log(value, key)
            if (key =='WF'){
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    wf.push(value.Area)})}
            else if (key =='PB'){
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    pb.push(value.Area)})}
            else{
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    Unknown.push(value.Area)})}                
            });
        
        console.log(wf);
        console.log(pb);
        console.log(Unknown);

        var wff = wf.map(Number);
        var WFsum = 0;
        for (var i in wff) {
            WFsum += wff[i];
        }
        console.log(WFsum)

        var UNKf = Unknown.map(Number);
        var UNKsum = 0;
        for (var i in UNKf) {
            UNKsum += UNKf[i];
        }
        console.log(UNKsum)

        var pbf = pb.map(Number);
        var pbsum = 0;
        for (var i in pbf) {
            pbsum += pbf[i];
        }
        console.log(pbsum)

        var allsums = [];
        allsums.push(WFsum)
        allsums.push(pbsum) 
        allsums.push(UNKsum)
        var names =['Wildfire','Prescribed Burn','Unknown']

        console.log(d3.max(allsums))

        var Graphdata = {"data":[{"Type":names[0], "Area": allsums[0]},
                                    {"Type":names[1], "Area": allsums[1]},
                                    {"Type":names[2], "Area": allsums[2]}]};

        var Gdata = Graphdata.data
        console.log(Graphdata.Area)


    // Select body, append SVG area to it, and set the dimensions
        var svg = d3.select("body")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

        // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
        var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

        
        // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
        
        var xBandScale = d3.scaleBand()
            .domain(Gdata.map(d => d.Type))
            .range([0, chartWidth])
            .padding(0.1);

        // Create a linear scale for the vertical axis.
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(Gdata, d=>d.Area)])
            .range([chartHeight,0]);

        // Create two new functions passing our scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Append two SVG group elements to the chartGroup area,
        // and create the bottom and left axes inside of them
        chartGroup.append("g")
            .attr('class', 'y axis')
            .call(leftAxis);

        chartGroup.append("g")
            .attr('class', 'x axis')
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
        
        // Create one SVG rectangle per piece of tvData
        // Use the linear and band scales to position each rectangle within the chart
        chartGroup.selectAll(".bar")
            .data(Gdata)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x",d => xBandScale(d.Type))
            .attr("y",d => yLinearScale(d.Area))
            .attr("width", xBandScale.bandwidth())
            .attr("height",d => chartHeight - yLinearScale(d.Area));

    });};




function setup(data){
    d3.require('d3').then(d3 =>{
        var Districtsdata = Array.from(d3.group(data, d => d.District ,  d => d.Year, d=>d.Type), ([key, value]) => ({key, value}));
        // const yearlydistrictdata = d3.group(Districtsdata, d=>d.Year);
        console.log(Districtsdata)
        var Districts = Object.values(Districtsdata)
        console.log(Districts)
        var districts = Districtsdata.map(function(element){
            // console.log(element.key);
            return element.key;

        }, this);

        var Yearsarrays = Districtsdata.map(function(element){
            // console.log(element.key);
            return element.value;

        }, this);




        console.log(districts)
        console.log(Yearsarrays[5])
        // let y = Yearsarrays[5]

        // const Years=[];
        // const arrays=[]; 
        // y.forEach((value, key) => {
        //     console.log(value, key)
        //     Years.push(key)
        //     arrays.push(value)
        //     return key;
        // },this);


        // console.log(Years)

        var Districtindex=[]

        d3.select('select.District')
            .on('change', () => UpdateYear(data)) // make sure .on() is above .selectAll()
            .selectAll('option')
            .data(districts)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d)
        
        d3.select('select.District').node().value = "PHL";

        // let Districtchosen = d3.select('select.District').property('value')
        // console.log(Districtchosen)
        // var districtindex =districts.indexOf(Districtchosen)
        // console.log(districtindex)
        // let districtdata = Yearsarrays[districtindex]
        // console.log(districtdata)
        // const Years=[];
        // districtdata.forEach((value, key) => {
        //     Years.push(key)
        //     return key;
        // },this);

        // console.log(Years)

        // d3.select('select.Year')
        //     .on('change', () => update(data))
        //     .selectAll('option')
        //     .data(Years)
        //     .enter()
        //     .append('option')
        //     .attr('value', d => d)
        //     .text(d => d)
        
        
       
        
        
        d3.select('select.Year').property('value', '1938')

        let Districtchosen = d3.select('select.District').property('value')
        console.log(Districtchosen)
        var districtindex =districts.indexOf(Districtchosen)
        console.log(districtindex)
        let districtdata = Yearsarrays[districtindex]
        console.log(districtdata)
        const Years=[];
        districtdata.forEach((value, key) => {
            Years.push(key)
            return key;
        },this);
    


        let District = d3.select('select.District').property('value')
        let Year = d3.select('select.Year').property('value')
        var districtindex =districts.indexOf(District)
        var yearindex = Years.indexOf(Year)
        console.log(Year)
        console.log(yearindex)

        let y = Yearsarrays[districtindex]



        const arrays=[]; 
        y.forEach((value, key) => {
            console.log(value, key)
            arrays.push(value)
            return key;
        },this);


        console.log(arrays[0])
        let allgraphdata= arrays[yearindex]
        const wf = [];
        const pb = [];
        const Unknown=[];
        allgraphdata.forEach((value, key) => {
            console.log(value, key)
            if (key =='WF'){
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    wf.push(value.Area)})}
            else if (key =='PB'){
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    pb.push(value.Area)})}
            else{
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    Unknown.push(value.Area)})}                
            });
        
        console.log(wf);
        console.log(pb);
        console.log(Unknown);

        var wff = wf.map(Number);
        var WFsum = 0;
        for (var i in wff) {
            WFsum += wff[i];
        }
        console.log(WFsum)

        var UNKf = Unknown.map(Number);
        var UNKsum = 0;
        for (var i in UNKf) {
            UNKsum += UNKf[i];
        }
        console.log(UNKsum)

        var pbf = pb.map(Number);
        var pbsum = 0;
        for (var i in pbf) {
            pbsum += pbf[i];
        }
        console.log(pbsum)

        var allsums = [];
        allsums.push(WFsum)
        allsums.push(pbsum) 
        allsums.push(UNKsum)
        var names =['Wildfire','Prescribed Burn','Unknown']

        console.log(d3.max(allsums))

        var Graphdata = {"data":[{"Type":names[0], "Area": allsums[0]},
                                    {"Type":names[1], "Area": allsums[1]},
                                    {"Type":names[2], "Area": allsums[2]}]};

        var Gdata = Graphdata.data
        console.log(Graphdata.Area)


    // Select body, append SVG area to it, and set the dimensions
        var svg = d3.select("body")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

        // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
        var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

        
        // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
        
        var xBandScale = d3.scaleBand()
            .domain(Gdata.map(d => d.Type))
            .range([0, chartWidth])
            .padding(0.1);

        // Create a linear scale for the vertical axis.
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(Gdata, d=>d.Area)])
            .range([chartHeight,0]);

        // Create two new functions passing our scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Append two SVG group elements to the chartGroup area,
        // and create the bottom and left axes inside of them
        chartGroup.append("g")
            .call(leftAxis);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
        
        // Create one SVG rectangle per piece of tvData
        // Use the linear and band scales to position each rectangle within the chart
        chartGroup.selectAll(".bar")
            .data(Gdata)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x",d => xBandScale(d.Type))
            .attr("y",d => yLinearScale(d.Area))
            .attr("width", xBandScale.bandwidth())
            .attr("height",d => chartHeight - yLinearScale(d.Area));

            scatterOuter.select
            .append('text')
            .attr('class', 'x axis')
            .attr('x', margins.left + innerWidth / 2)
            .attr('y', outerHeight - margins.bottom / 2)
            .attr('text-anchor', 'middle')
            .text(longVars[xvar])
        
          scatterOuter
            .append('text')
            .attr('class', 'y axis')
            .attr('x', margins.left / 2)
            .attr('y', margins.bottom + innerHeight / 2)
            .attr('text-anchor', 'middle')
            .attr(
              'transform',
              `rotate(-90 ${margins.left / 2} ${margins.bottom + innerHeight / 2})`
            )
            .text(longVars[yvar])

    });};

function update(data){

    d3.require('d3').then(d3 =>{
        var Districtsdata = Array.from(d3.group(data, d => d.District ,  d => d.Year, d=>d.Type), ([key, value]) => ({key, value}));
        // const yearlydistrictdata = d3.group(Districtsdata, d=>d.Year);
        console.log(Districtsdata)
        var Districts = Object.values(Districtsdata)
        console.log(Districts)
        var districts = Districtsdata.map(function(element){
            // console.log(element.key);
            return element.key;

        }, this);

        var Yearsarrays = Districtsdata.map(function(element){
            // console.log(element.key);
            return element.value;

        }, this);






        console.log(districts)
        console.log(Yearsarrays[5])

        let District = d3.select('select.District').property('value')

        var districtindex =districts.indexOf(District)
        let up = Yearsarrays[districtindex]
        const Years=[];
        up.forEach((value, key) => {
            Years.push(key)
            return key;
        },this);
        
        
        let Year = d3.select('select.Year').property('value')
        var yearindex = Years.indexOf(Year)

        const arrays=[]; 
        up.forEach((value, key) => {
            console.log(value, key)
            arrays.push(value)
            return key;
        },this);


        console.log(yearindex)
        let allgraphdata= arrays[yearindex]
        const wf = [];
        const pb = [];
        const Unknown=[];
        console.log(allgraphdata)
        allgraphdata.forEach((value, key) => {
            console.log(value, key)
            if (key =='WF'){
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    wf.push(value.Area)})}
            else if (key =='PB'){
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    pb.push(value.Area)})}
            else{
                value.forEach((value, key) => {
                    console.log(value.Area, key)
                    Unknown.push(value.Area)})}                
            });

        console.log(wf);
        console.log(pb);
        console.log(Unknown);

        var wff = wf.map(Number);
        var WFsum = 0;
        for (var i in wff) {
            WFsum += wff[i];
        }
        console.log(WFsum)

        var UNKf = Unknown.map(Number);
        var UNKsum = 0;
        for (var i in UNKf) {
            UNKsum += UNKf[i];
        }
        console.log(UNKsum)

        var pbf = pb.map(Number);
        var pbsum = 0;
        for (var i in pbf) {
            pbsum += pbf[i];
        }
        console.log(pbsum)

        var allsums = [];
        allsums.push(WFsum)
        allsums.push(pbsum) 
        allsums.push(UNKsum)
        var names =['Wildfire','Prescribed Burn','Unknown']

        console.log(d3.max(allsums))
        console.log(allsums)
        var Graphdata = {"data":[{"Type":names[0], "Area": allsums[0]},
                                    {"Type":names[1], "Area": allsums[1]},
                                    {"Type":names[2], "Area": allsums[2]}]};

        var Gdata = Graphdata.data
        console.log(Gdata)

        // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)

        var xBandScale = d3.scaleBand()
            .domain(Gdata.map(d => d.Type))
            .range([0, chartWidth])
            .padding(0.1);

        // Create a linear scale for the vertical axis.
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(Gdata, d=>d.Area)])
            .range([chartHeight,0]);

        // Create two new functions passing our scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Append two SVG group elements to the chartGroup area,
        // and create the bottom and left axes inside of them
        var svg = d3.select("body")

        var chartGroup = svg.select("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

        chartGroup.select('.y.axis')
            .transition()
            .duration(transitionTime)
            .call(leftAxis);

        chartGroup.select('.x.axis')
            .transition()
            .duration(transitionTime)
            .call(bottomAxis);


        // Create one SVG rectangle per piece of tvData
        // Use the linear and band scales to position each rectangle within the chart
        chartGroup.selectAll(".bar")
            .data(Gdata)
            .join(enter =>
                        enter
                            .append("rect")
                            .attr("class", "bar")
                            .attr("x",d => xBandScale(d.Type))
                            .attr("y",d => yLinearScale(d.Area))
                            .attr("width", xBandScale.bandwidth())
                            .attr("height",d => chartHeight - yLinearScale(d.Area)),
                    update =>
                        update
                            .transition()
                            .duration(transitionTime)
                            .attr("x",d => xBandScale(d.Type))
                            .attr("y",d => yLinearScale(d.Area))
                            .attr("height",d => chartHeight - yLinearScale(d.Area)),
                    exit =>
                        exit
                            .transition()
                            .duration(transitionTime)
                            .remove()
                        )
        
    })};

    function UpdateYear(data){
        d3.require('d3').then(d3 =>{
            var Districtsdata = Array.from(d3.group(data, d => d.District ,  d => d.Year, d=>d.Type), ([key, value]) => ({key, value}));
            // const yearlydistrictdata = d3.group(Districtsdata, d=>d.Year);
            console.log(Districtsdata)
            var Districts = Object.values(Districtsdata)
            console.log(Districts)
            var districts = Districtsdata.map(function(element){
                // console.log(element.key);
                return element.key;
    
            }, this);
    
            var Yearsarrays = Districtsdata.map(function(element){
                // console.log(element.key);
                return element.value;
    
            }, this);
    
    
    
    
            console.log(districts)
            let Districtchosen = d3.select('select.District').property('value')
            console.log(Districtchosen)
            var districtindex =districts.indexOf(Districtchosen)
            console.log(districtindex)
            let districtdata = Yearsarrays[districtindex]
            console.log(districtdata)
            const Years=[];
            districtdata.forEach((value, key) => {
                Years.push(key)
                return key;
            },this);
            
            var sortedYears = Years.sort()

            console.log(sortedYears)

            d3.select('select.Year')
                .on('change', () => update(data))
                .selectAll('option')
                .data(sortedYears)
                .enter()
                .append('option')
                .attr('value', d => d)
                .text(d => d)
        })};