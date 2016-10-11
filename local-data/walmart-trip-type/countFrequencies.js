const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');
const jsonfile = require('jsonfile');

const inputPath = `input`;
const outputPath = `output`;

const csvfile1 = `${inputPath}/train-subset-20k.csv`;

const data = d3.csv.parse(fs.readFileSync(csvfile1, 'utf8'));
const tripTypes = data.map(d => d.TripType);
const counts = {};
const array = tripTypes;

for(let i = 0; i< array.length; i++) {
    const num = array[i];
    counts[num] = counts[num] ? counts[num]+1 : 1;
}

const outputData = counts;

// write a json file
const outputFile = `${outputPath}/frequencyCounts.json`;
jsonfile.spaces = 2;
jsonfile.writeFile(outputFile, outputData, function (err) {
  console.error(err)
})

