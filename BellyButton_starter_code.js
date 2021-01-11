function init() {
  
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
  // console.log(data);
   
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
  //alert("option changed");
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  console.log("sample = " + sample);
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(data);

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

// Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // console.log("inside buildcharts"); 
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);  
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // D3 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // console.log(result);

    // D3 2. Create a variable that holds the first sample in the metadata array.   
    var result2 = metadataArray[0];
    // console.log(result2);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var PANEL = d3.select("#sample-metadata");
    var new_otu_ids = result.otu_ids;
    // console.log(new_otu_ids);

    var new_otu_labels = result.otu_labels;
    // console.log(new_otu_labels);

    var new_sample_values = result.sample_values;
    // console.log(new_sample_values);

    // D3 3. Create a variable that holds the washing frequency.
    var washingFrequency = result2.wfreq;
    console.log("washing frequency = " + washingFrequency);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedotu_ids = new_otu_ids.sort((a,b) => a.new_otu_ids-b.new_otu_ids);
    // console.log (sortedotu_ids);
    var yticks = sortedotu_ids.slice(0,10).reverse();
    console.log(yticks);

    // Creating xticks for bar chart
    var sorted_sample_values = new_sample_values.sort((a,b) => a.new_sample_values-b.new_sample_values);
    // console.log(sorted_sample_values);
    var xticks = sorted_sample_values.slice(0,10).reverse();
    console.log(xticks);
   
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x : xticks,
      y : yticks.map(otuID => `OTU ${otuID}`),
      text : new_otu_labels,
      type :"bar" ,
      orientation : "h"
    }];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 500, height: 500,
      title: "<b> Top 10 Bacteria Cultures Found </b>",
      margin: { t: 30, l: 150 }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

    // Deliverable - 2
    //  1. Create the trace for the bubble chart.
     var bubbleData = [{
        x : new_otu_ids,
        y : new_sample_values,
        mode: 'markers',
        type: 'scatter',
        text : new_otu_labels,
        marker: {
          color: new_otu_ids,
          size: new_sample_values,
          colorscale: 'Earth',
        }
      }]; 
  
   // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      
      title : " <b> Bacteria Cultures per sample </b>",
      xaxis: { title: "OTU ID" }
      // mode="onlyPoint",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable - 3
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> Belly button washing frequency</b> <br> scrubs per week" },
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" }
        ],
        threshold: {
          value: washingFrequency,
        }
      },
      
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 },
      font: { color: "black"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
