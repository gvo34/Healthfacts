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
    bottom: 50,
    left: 150
  };


  // chart area minus margins
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;


  // Import Data 1
  d3.csv("assets/data/lastcheck.csv", function (err, stateData) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function (d) {
      d.limitedEnglish = +d.limitedEnglish
      d.NoCoverage = +d.NoCoverage;
      d.LastCheck5 = +d.LastCheck5;
      d.CostNoVisit = +d.CostNoVisit;
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


    // Multile axis for different scales
    // var yAxisNC = d3.axisLeft(yScaleNC);    
    // var yAxisLV = d3.axisLeft(yScaleLV);
    // var yAxisCV = d3.axisLeft(yScaleCV);
    // var xAxis = d3.axisBottom(xScaleLE);
    // chartGroup.append("g")
    // .attr("transform", `translate(0, ${chartHeight})`)
    // .call(xAxis);
    // // set y to the y axis
    // chartGroup.append("g")
    // .call(yAxisNC);
    // chartGroup.append("g")
    // .attr("transform",`translate(${50}, 0)`)
    // .call(yAxisLV);
    // chartGroup.append("g")
    // .attr("transform",`translate(${100}, 0)`)
    // .call(yAxisCV);



    // append circles to data points
    var circlesAndtextGroup = chartGroup.append("g");

    var circlesGroup = circlesAndtextGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(d.limitedEnglish))
      .attr("cy", d => yScale(d.NoCoverage))
      .attr("r", "10")
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
        .duration(1000)
        .attr("r", 20)
        .attr("fill", "grey");
      toolTip.show(d);
    })
      .on("mouseout", function(d){
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("r", 10)
          .attr("fill", "lightblue");
        toolTip.hide(d);
      })



    // Create axes labels

    var labels1Group = chartGroup.append("g");

    labels1Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  40})`)
    .attr("class","axis-text")
    .text("Population for Limited English Households");

    labels1Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 50)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text("No Health Coverage % ");

    labels1Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("cx", (d, i) => xScale(d.limitedEnglish))
        .attr("cy", d => yScale(d.NoCoverage));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.limitedEnglish))
        .attr("y", d => yScale(d.NoCoverage))
        .attr("dx", function(d){return -7})
        .attr("dy", function(d){return +4})
    });
    
    var labels2Group = chartGroup.append("g");

    labels2Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 80)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text("No Visit due to cost");

    labels2Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "red")
        .attr("cx", (d, i) => xScale(d.limitedEnglish))
        .attr("cy", d => yScale(d.CostNoVisit));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.limitedEnglish))
        .attr("y", d => yScale(d.CostNoVisit))
        .attr("dx", function(d){return -7})
        .attr("dy", function(d){return +4})
    });

    var labels3Group = chartGroup.append("g");

    labels3Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 110)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text("Last Visit in te past 5 years");

    labels3Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightgreen")
        .attr("cx", (d, i) => xScale(d.limitedEnglish))
        .attr("cy", d => yScale(d.LastCheck5));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.limitedEnglish))
        .attr("y", d => yScale(d.LastCheck5))
        .attr("dx", function(d){return -7})
        .attr("dy", function(d){return +4})
    });
    // labels2Group.append("text")
    // .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  40})`)
    // .attr("class","axis-text")
    // .text("Population for Limited English Households");






    
    chartGroup.call(toolTip);
    }); // end of csv data 1


  }; // end of MakeResponsive