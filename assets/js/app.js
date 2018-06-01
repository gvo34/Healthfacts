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

  // Labels to match input values for the scatter plot (demographics for x values and brfss for y values)
  // demog1, demog2
  demographics = ["demographics 1", 
                  "demographics 2",
                  "demographics 3"];
  // brfss1, brfss2, brfss3
  behaviour_risk_factor_ss = ["Last Checkup Visit over 5 years",
                              "No Visit due to cost",
                              "No Health Insurance Coverage"]


  // Import Data 1
  d3.csv("assets/data/data3.csv", function (err, stateData) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function (d) {
      // x-values
      d.demog1 = +d.demog1;
      d.demog2 = +d.demog2;

      // y-values
      d.brfss1 = +d.brfss1;
      d.brfss2 = +d.brfss2;
      d.brfss3 = +d.brfss3;
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
      .domain([0, d3.max(stateData, d => d.demog1)])
      .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(stateData,d => d.brfss1)])
      .range([chartHeight, 0]);
    

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
      .attr("cx", (d, i) => xScale(d.demog1))
      .attr("cy", d => yScale(d.brfss1))
      .attr("r", "10")
      .style("opacity",0.5)
      .attr("fill", "lightblue");

    circlesAndtextGroup.selectAll("states")
      .data(stateData)
      .enter()
      .append("text")
      .attr("x", (d, i) => xScale(d.demog1))
      .attr("y", d => yScale(d.brfss1))
      .attr("dx", function(d){return -7})
      .attr("dy", function(d){return +4})
      .text(function(d){return d.ST})
      .attr("class","circle-text");

    // Event listeners with transitions
    var toolTip = d3.tip()
      .attr("class","tooltip")
      .offset([80,-60])
      .html(function(d){
        return (`<strong>${d.state}<strong><hr>${d.demog1} / ${d.brfss1}`);
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
    .text(demographics[0]);

    labelsX1Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("cx", (d, i) => xScale(d.demog1));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.demog1))
        .attr("dx", function(d){return -7})
      
      xScale 
        .trasition()
        .duration(1000)
        .domain([0, d3.max(stateData, d => d.demog1)]);
    });

    var labelsX2Group = chartGroup.append("g");

    labelsX2Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  60})`)
    .attr("class","axis-text")
    .text(demographics[1]);

    labelsX2Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightgreen")
        .attr("cx", (d, i) => xScale(d.demog2));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.demog2))
        .attr("dx", function(d){return -7})
      
      xScale 
        .trasition()
        .duration(1000)
        .domain([0, d3.max(stateData, d => d.demog2)]);
    });

    var labelsX3Group = chartGroup.append("g");

    labelsX3Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  80})`)
    .attr("class","axis-text")
    .text(demographics[2]);

    labelsX3Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightgreen")
        .attr("cx", (d, i) => xScale(d.demog3));

      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.demog3))
        .attr("dx", function(d){return -7})
      
      xScale 
        .trasition()
        .duration(1000)
        .domain([0, d3.max(stateData, d => d.demog3)]);
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
    .text(behaviour_risk_factor_ss[0]);
    labelsY1Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("cy", d => yScale(d.brfss1));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.brfss1))
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
    .text(behaviour_risk_factor_ss[1]);
    labelsY2Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "red")
        .attr("cy", d => yScale(d.brfss2));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.brfss2))
        .attr("dy", function(d){return +4})
    });

    var labelsY3Group = chartGroup.append("g");
    labelsY3Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 110)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text")
    .text(behaviour_risk_factor_ss[2]);
    labelsY3Group.on("click",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "lightgreen")
        .attr("cy", d => yScale(d.brfss3));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.brfss3))
        .attr("dy", function(d){return +4})
    });


    // add tool tip for pop up
    chartGroup.call(toolTip);


  }); // end of csv data 1


  }; // end of MakeResponsive