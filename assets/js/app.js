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
  demographics = ["Median Age", 
                  "% Below Poverty Level",
                  "Percent Imputed Limited English"];
  // brfss1, brfss2, brfss3
  behaviour_risk_factor_ss = ["% Tobacco Users",
                              "% Limited due to Physycal, Mental or emotional problems",
                              "% Binge Drinkers"]


  // Import Data 1
  d3.csv("assets/data/data.csv", function (err, stateData) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function (d) {
      // x-values : demographic 
      d.demog1 = +d.demog1;
      d.demog2 = +d.demog2;
      d.demog3 = +d.demog3;

      // y-values : behaviour risk factors
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
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);
    
      // set y to the y axis
    chartGroup.append("g")
      .attr("class", "y axis")
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
      .style("stroke","black")
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
        return (`<strong>${d.state}<strong>`);
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

    // X- labels 
    var labelsX1Group = chartGroup.append("g");

    labelsX1Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  40})`)
    .attr("class","axis-text demog1")
    .style("fill","#1a56afb7")
    .text(demographics[0]);

    labelsX1Group.on("click",function(d){
      // reset the scale to demographic 1 range
      xScale 
        .domain([0, d3.max(stateData, d => d.demog1)]);
      // update the circles
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .style("stroke","black")
        .attr("cx", (d, i) => xScale(d.demog1));
      // update the text inside the circles (states)
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.demog1))
        .attr("dx", function(d){return -7})
      // redraw the axis
      d3.selectAll("g.x.axis")
        .call(xAxis);

      // update axis text color to highlight the selected demographic
      d3.selectAll("axis-text.demog1")
        .transition()
        .duration(1000)
        .style("fill", "black");
      d3.selectAll("axis-text.demog2")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
      d3.selectAll("axis-text.demog3")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
    });

    var labelsX2Group = chartGroup.append("g");

    labelsX2Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  60})`)
    .attr("class","axis-text demog2")
    .style("fill","#1a56afb7")
    .text(demographics[1]);

    labelsX2Group.on("click",function(d){
      // reset the scale to demographic 2 range
      xScale 
        .domain([0, d3.max(stateData, d => d.demog2)]);
      // update the circles
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .style("stroke","red")
        .attr("cx", (d, i) => xScale(d.demog2));
      // update the text inside the circles (states)
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.demog2))
        .attr("dx", function(d){return -7})
      // redraw the axis
      d3.selectAll("g.x.axis")
        .call(xAxis);

      // update axis text color to highlight the selected demographic
      d3.selectAll("axis-text.demog2")
        .transition()
        .duration(1000)
        .style("fill", "black");
      d3.selectAll("axis-text.demog1")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
      d3.selectAll("axis-text.demog3")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");  
    });

    var labelsX3Group = chartGroup.append("g");

    labelsX3Group.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight +  80})`)
    .attr("class","axis-text demog3")
    .style("fill","#1a56afb7")
    .text(demographics[2]);

    labelsX3Group.on("click",function(d){
      // reset the scale to the demographic 3 range      
      xScale 
        .domain([0, d3.max(stateData, d => d.demog3)]);
      // update the circles
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .style("stroke","orange")
        .attr("cx", (d, i) => xScale(d.demog3));
      // update the states
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(d.demog3))
        .attr("dx", function(d){return -7})
      // redraw the axis
      d3.selectAll("g.x.axis")
        .call(xAxis);

      // update axis text color to highlight the selected demographic
      d3.selectAll("axis-text.demog3")
      .transition()
      .duration(1000)
      .style("fill", "black");
      d3.selectAll("axis-text.demog2")
      .transition()
      .duration(1000)
      .style("fill", "#1a56afb7");
      d3.selectAll("axis-text.demog1")
      .transition()
      .duration(1000)
      .style("fill", "#1a56afb7");     
    });


    // Y- labels
    
    var labelsY1Group = chartGroup.append("g");
    labelsY1Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 50)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text brfss1")
    .style("fill","#1a56afb7")
    .text(behaviour_risk_factor_ss[0]);
    labelsY1Group.on("click",function(d){
      // reset scale to corrent range
      yScale 
        .domain([0, d3.max(stateData, d => d.brfss1)]);
      // redraw at new center circle and text
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
        .attr("dy", function(d){return +4});
      // redraw the axis
      d3.selectAll("g.y.axis")
        .call(yAxis);
      // update axis text color to highlight the selected demographic
      d3.selectAll("axis-text.brfss1")
        .transition()
        .duration(1000)
        .style("fill", "black");
      d3.selectAll("axis-text.brfss2")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
      d3.selectAll("axis-text.brfss3")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
    });
    
    var labelsY2Group = chartGroup.append("g");
    labelsY2Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 80)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text brfss2")
    .style("fill","#1a56afb7")
    .text(behaviour_risk_factor_ss[1]);
    labelsY2Group.on("click",function(d){
      // reset scale to corrent range
      yScale 
        .domain([0, d3.max(stateData, d => d.brfss2)]);
      // redraw at new center circle and text
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "purple")
        .attr("cy", d => yScale(d.brfss2));
      d3.selectAll(".circle-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.brfss2))
        .attr("dy", function(d){return +4});
      // redraw the axis
      d3.selectAll("g.y.axis")
        .call(yAxis);
      // update axis text color to highlight the selected demographic
      d3.selectAll("axis-text.brfss1")
        .transition()
        .duration(1000)
        .style("fill", "black");
      d3.selectAll("axis-text.brfss1")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
      d3.selectAll("axis-text.brfss3")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
    });

    var labelsY3Group = chartGroup.append("g");
    labelsY3Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 110)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "10em")
    .attr("class","axis-text brfss3")
    .style("fill","#1a56afb7")
    .text(behaviour_risk_factor_ss[2]);
    labelsY3Group.on("click",function(d){
      // reset scale to corrent range
      yScale 
        .domain([0, d3.max(stateData, d => d.brfss3)]);
      // redraw at new center circle and text
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
        .attr("dy", function(d){return +4});
      // redraw the axis
      d3.selectAll("g.y.axis")
        .call(yAxis);
      // update axis text color to highlight the selected demographic
      d3.selectAll("axis-text.brfss3")
        .transition()
        .duration(1000)
        .style("fill", "black");
      d3.selectAll("axis-text.brfss2")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
      d3.selectAll("axis-text.brfss1")
        .transition()
        .duration(1000)
        .style("fill", "#1a56afb7");
    });


    // add tool tip for pop up
    chartGroup.call(toolTip);


  }); // end of csv data 1


  }; // end of MakeResponsive