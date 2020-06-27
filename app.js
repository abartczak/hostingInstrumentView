function DrawBarChart(selSampleID)
{
    console.log("DrawBarChart: sample = ", selSampleID);

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [ {
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                type: "bar",
                text: otu_labels.slice(0, 10).reverse(),
                orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}

function DrawIndicatorChart(selSampleID)
{
    console.log("DrawIndicatorChart: sample = ", selSampleID);

    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];
        var washFreq = result.wfreq;
        console.log(washFreq);

        var gaugeData = [ {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 10 },
              gauge: { axis: { 
                        tickmode: "array",
                        range: [null, 9],
                        tickvals: 9,
                        ticktext: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '8-9'],
                        ticks: "outside"
              }}
        }];

        var gaugeLayout = {
            title: "Belly Button Washing Frequency",
            margin: { t: -10, b: -10 },
            width: 600, height: 400
        };

        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}

function DrawBubbleChart(selSampleID)
{
    console.log("DrawBubbleChart: sample =", selSampleID);

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
            }}
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 0},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t: 30}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });    
}

function ShowMetadata(selSampleID)
{
    console.log("ShowMetadata: sample =", selSampleID);

    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];
        console.log(result);

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            var textToShow = `${key.toUpperCase()}: ${value}`;
            PANEL.append("h6").text(textToShow);
        });
    });
}

function optionChanged(newSampleID)
{
    console.log("Dropdown changed to: ", newSampleID);

    ShowMetadata(newSampleID);
    DrawBarChart(newSampleID);
    DrawIndicatorChart(newSampleID);
    DrawBubbleChart(newSampleID);
}

function Init()
{
    console.log("Initializing Screen");
    // Populate dropdown
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sampleID) => {
            selector
                .append("option")
                .text(sampleID)
                .property("value", sampleID);
        });

        var sampleID = sampleNames[0];

        DrawBarChart(sampleID);
        DrawIndicatorChart(sampleID);
        DrawBubbleChart(sampleID);
        ShowMetadata(sampleID);
    });
}

Init();
