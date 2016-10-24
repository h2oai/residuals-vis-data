const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const csvWriter = require('csv-write-stream');

const grupoBimboConfig = {
  project: 'grupo-bimbo-inventory-demand',
  filePrefix: 'gb-',
  fileStem: 'drf',
  fileSuffix: '-aggregated-0-05'
 }

const wineConfig = {
  project: 'wine',
  filePrefix: '',
  fileStem: 'glm',
  fileSuffix: '-wine-predictions-deviances'
 }

const config = wineConfig;
const project = config.project;
const filePrefix = config.filePrefix;
const fileSuffix = config.fileSuffix;
const fileStem = config.fileStem;

const outputPath = `../../local-data/${project}`;
const csvfile1 = `${outputPath}/${filePrefix}${fileStem}${fileSuffix}.csv`;
const data = d3.csv.parse(fs.readFileSync(csvfile1, 'utf8'));

const outputData = data;
var outputFile = `${outputPath}/${filePrefix}${fileStem}${fileSuffix}.json`
jsonfile.spaces = 2;

jsonfile.writeFile(outputFile, outputData, function (err) {
  console.error(err)
})