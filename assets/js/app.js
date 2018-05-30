// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);



makeResponsive();

function makeResponsive(){

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select(".chart").select("svg");

  if (!svgArea.empty()) {
      svgArea.remove();
  }
  
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth;

  var margin = {
    top: 50,
    right: 50,
    bottom: 150,
    left: 150
  };


  // chart area minus margins
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;


  // Import Data 1
  d3.csv("assets/data/data.csv", function (err, stateData) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function (d) {
      d.limitedEnglish = +d.limitedEnglish
      d.NoCoverage = +d.NoCoverage;
      d.LastCheck5 = +d.LastCheck5;
      d.CostNoVisit = +d.CostNoVisit;
      d.Pop65 = +d.Pop65;
    });

    console.log(stateData);


    // append svg and group
    var svg = d3.select(".chart")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scales

    var xScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.limitedEnglish)])
      .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(stateData,d => d.NoCoverage)])
      .range([chartHeight, 0]);

    // Multiple Scales for different values
    // var xScaleLE = d3.scaleLinear()
    //   .domain([0, d3.max(stateData, d => d.LimitedEnglish)])
    //   .range([0, chartWidth]);

    // var yScaleNC = d3.scaleLinear()
    //   .domain([0, d3.max(stateData,d => d.NoCoverage)])
    //   .range([chartHeight, 0]);

    // var yScaleLV = d3.scaleLinear()
    //   .domain([0, d3.max(stateData,d => d.LastVisit5)])
    //   .range([chartHeight, 0]);

    // var yScaleCV = d3.scaleLinear()
    //   .domain([0, d3.max(stateData,d => d.CostNoVisit)])
    //   .range([chartHeight, 0]);
  

    
    // line generator
    var line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));



    // create axes
    var yAxis = d3.axisLeft(yScale);    
    var xAxis = d3.axisBottom(xScale);
    // set x to the bottom of the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);
    // set y to the y axis
    chartGroup.append("g")
      .call(yAxis);

    // append circles to data points to initial display 

    var circlesAndtextGroup = chartGroup.append("g");

    var circlesGroup = circlesAndtextGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(d.limitedEnglish))
      .attr("cy", d => yScale(d.NoCoverage))
      .attr("r", "10")
      .style("opacity",0.5)
      .attr("fill", "lightblue");

    circlesAndtextGroup.selectAll("states")
      .data(stateData)
      .enter()
      .append("text")
      .attr("x", (d, i) => xScale(d.limitedEnglish))
      .attr("y", d => yScale(d.NoCoverage))
      .attr("dx", function(d){return -7})
      .attr("dy", function(d){return +4})
      .text(function(d){return d.ST})
      .attr("class","circle-text");

    // Event listeners with transitions
    
    var toolTip = d3.tip()
      .attr("class","tooltip")
      .offset([80,-60])
      .html(function(d){
        return (`<strong>${d.NoCoverage}<strong><hr>${d.limitedEnglish}`);
      })
    
    circlesGroup.on("mouseover", function(d){
      d3.select(this)
        .transition()
        .duration(500)
        .attr("r", 20)
        .style("opacity",1);
      toolTip.show(d);
    })
      .on("mouseout", function(d){
        d3.select(this)
          .transition()
          .duration(500)
          .attr("r", 10)
          .style("opacity",0.5);
        toolTip.hide(d);
      })



    // Create axes labels

    // X- labels and scale
    // X1 : data point 1
    // X2 : data point 2
    var labelsX1Group = chartGroup.append("g");

    labelsX1Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  40})`)
    .attr("class","axis-text")
    .text("Population for Limited English Households");

    labelsX1Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("cx", (d, i) => xScale(d.limitedEnglish));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.limitedEnglish))
        .attr("dx", function(d){return -7})
      
      xScale 
        .trasition()
        .duration(1000)
        .domain([0, d3.max(stateData, d => d.limitedEnglish)]);
    });

    var labelsX2Group = chartGroup.append("g");

    labelsX2Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  60})`)
    .attr("class","axis-text")
    .text("Age over 65");

    labelsX2Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightgreen")
        .attr("cx", (d, i) => xScale(d.Pop65));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.Pop65))
        .attr("dx", function(d){return -7})
      
      xScale 
        .trasition()
        .duration(1000)
        .domain([0, d3.max(stateData, d => d.Pop65)]);
    });



    // Y- labels
    // Y1: set Y values to Y1 data point 
    // Y2: set Y values to Y2 data point 
    // Y3: set Y values to Y3 data point 

    var labelsY1Group = chartGroup.append("g");
    labelsY1Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 50)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text("No Health Coverage % ");
    labelsY1Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("cy", d => yScale(d.NoCoverage));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.NoCoverage))
        .attr("dx", function(d){return -7})
        .attr("dy", function(d){return +4})
    });
    
    var labelsY2Group = chartGroup.append("g");
    labelsY2Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 80)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text("No Visit due to cost");
    labelsY2Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "red")
        .attr("cy", d => yScale(d.CostNoVisit));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.CostNoVisit))
        .attr("dy", function(d){return +4})
    });

    var labelsY3Group = chartGroup.append("g");
    labelsY3Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 110)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text("Last Visit in te past 5 years");
    labelsY3Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightgreen")
        .attr("cy", d => yScale(d.LastCheck5));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.LastCheck5))
        .attr("dy", function(d){return +4})
    });


    // add tool tip for pop up
    chartGroup.call(toolTip);


  }); // end of csv data 1


  }; // end of MakeResponsive