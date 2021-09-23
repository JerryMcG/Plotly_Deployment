function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleSelect = samplesData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleSelect[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleSelect.map(person => person.otu_ids);
    var otu_labels = sampleSelect.map(person => person.otu_labels);
    var sample_values= sampleSelect.map(person => person.sample_values);
    console.log(otu_ids);
    //console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = firstSample.otu_ids.sort((a,b) => b-a).slice(0,10);
    var yvals = yticks.map(i => "OTU" + i)
    var xticks = firstSample.sample_values.sort((a,b) => b-a).slice(0,10).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yvals,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria Cultures Found",
      yaxis: { ticktext: yvals}
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var otuLabels = firstSample.otu_labels.sort((a,b) => b-a).slice(0,10);

    var bubbleData = [{
      type: "scatter",
      mode: "markers",
      x: xticks,
      y: yticks,
      text: otuLabels,
      marker: {
          size: xticks,
          sizemode: 'area',
          color: xticks,
          colorscale: 'Rainbow'
        },
      }];
    //console.log(bubbleData);

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    //gauge chart
    // 3. Create a variable that holds the washing frequency.
    var metaSelect = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(metaSelect);
    var wfreqArray = metaSelect.map(person => person.wfreq).sort((a,b) => b - a).filter(element => element !=null);
    var wfreq = wfreqArray[0];
    //console.log(wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10]},
        threshold: {line: {color: "black"}},
        steps: [
          {range: [0,2], color: "cornflowerblue"},
          {range: [2,4], color: "royalblue"},
          {range: [4,6], color: "mediumslateblue"},
          {range: [6,8], color: "darkorchid"},
          {range: [8,10], color: "purple"}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title:"Belly Button Washing Frequency" 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
  //});
}
