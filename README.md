# Healthfacts

D3 visualization project.

Cross reference data from Census demographics ([American FactFinder tool](http://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml) filtered for 2014 data) and fact finder ([Behavioral Risk Factor Surveillance System](https://chronicdata.cdc.gov/Behavioral-Risk-Factors/BRFSS-2014-Overall/5ra3-ixqq)) to visualize the data correlation for some health factors and demographics per USA state. This exercise employs D3.js to provide user data selection to navigate through up to nine pairs of data set.


### Input

The data used to display the interactive scatter plot is taken from the the following two files located in the data folder:

- *data.csv*: contains different facts in columns per state 
- *labels.csv*: contains the names for the different facts in data.csv to be displayed in the chart.

### Output

Rendering (dafault data) is available in https://gvo34.github.io/Healthfacts/

What is displayed: xaxis represent demographic data, yaxis represent behaviour factors. Selection is highlighted in black titles. Coloring changes according to the selection. Circle colors match yaxis selection. Border color matches x axis selection.


