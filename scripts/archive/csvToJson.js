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

grupoBimboEfFileStems = [
  "glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5",
  "drf-c70bb027-a911-4f67-a754-bb25c31f7ae8",
  "gbm-6453814e-3bfb-4764-b409-b29787447183",
  "gbm-cfcd9d90-108b-42f4-bd19-90de6e6fafd8",
  "gbm-5933fc16-fb84-4d92-9859-831f62244660"
]

const grupoBimboEfConfig = {
  project: 'grupo-bimbo-inventory-demand',
  filePrefix: 'gb-ef-',
  fileStem: grupoBimboEfFileStems[4],
  fileSuffix: '-aggregated-0-8'
 }

const wineConfig = {
  project: 'wine',
  filePrefix: '',
  fileStem: 'wine-drf',
  fileSuffix: '-combined-predictions-deviances'
 }

const config = wineConfig;

const project = config.project;
const filePrefix = config.filePrefix;
const fileSuffix = config.fileSuffix;
const fileStem = config.fileStem;

const outputPath = `../../local-data/${project}/output`;
const csvfile1 = `${outputPath}/${filePrefix}${fileStem}${fileSuffix}.csv`;
const data = d3.csv.parse(fs.readFileSync(csvfile1, 'utf8'));

const outputData = data;
var outputFile = `${outputPath}/${filePrefix}${fileStem}${fileSuffix}.json`
jsonfile.spaces = 2;

jsonfile.writeFile(outputFile, outputData, function (err) {
  console.error(err)
})