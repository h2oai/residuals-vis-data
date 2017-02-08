const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');
const csvWriter = require('csv-write-stream');

grupoBimboConfig = {
  project: 'grupo-bimbo-inventory-demand',
  combinedFilename: 'gb-ef-aggregated-combined-deviances-0-8.csv',
  models: [
    {
      id: 'drf-c70bb027-a911-4f67-a754-bb25c31f7ae8',
      algo: 'drf',
      description: 'Random Forest',
      file: 'gb-ef-drf-c70bb027-a911-4f67-a754-bb25c31f7ae8-aggregated-0-8.csv'
    },
    {
      id: 'gbm-5933fc16-fb84-4d92-9859-831f62244660',
      algo: 'gbm',
      description: '2k Trees GBM',
      file: 'gb-ef-gbm-5933fc16-fb84-4d92-9859-831f62244660-aggregated-0-8.csv'  
    },
    {
      id: 'gbm-6453814e-3bfb-4764-b409-b29787447183',
      algo: 'gbm',
      description: '50 Trees GBM',
      file: 'gb-ef-gbm-6453814e-3bfb-4764-b409-b29787447183-aggregated-0-8.csv'  
    },
    {
      id: 'gbm-cfcd9d90-108b-42f4-bd19-90de6e6fafd8',
      algo: 'gbm',
      description: '1k Trees GBM',
      file: 'gb-ef-gbm-cfcd9d90-108b-42f4-bd19-90de6e6fafd8-aggregated-0-8.csv'  
    },
    {
      id: 'glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5',
      algo: 'glm',
      description: 'GLM',
      file: 'gb-ef-glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5-aggregated-0-8.csv'  
    }
  ]
}

grupoBimboSmallConfig = {
  project: 'grupo-bimbo-inventory-demand',
  combinedFilename: 'gb-ef-aggregated-combined-deviances-2.csv',
  models: [
    {
      id: 'drf-c70bb027-a911-4f67-a754-bb25c31f7ae8',
      algo: 'drf',
      description: 'Random Forest',
      file: 'gb-ef-aggregated-2-drf-c70bb027-a911-4f67-a754-bb25c31f7ae8.csv'
    },
    {
      id: 'gbm-5933fc16-fb84-4d92-9859-831f62244660',
      algo: 'gbm',
      description: '2k Trees GBM',
      file: 'gb-ef-aggregated-2-gbm-5933fc16-fb84-4d92-9859-831f62244660-2000-trees.csv'  
    },
    {
      id: 'gbm-6453814e-3bfb-4764-b409-b29787447183',
      algo: 'gbm',
      description: '50 Trees GBM',
      file: 'gb-ef-aggregated-2-gbm-6453814e-3bfb-4764-b409-b29787447183-50-trees.csv'  
    },
    {
      id: 'gbm-cfcd9d90-108b-42f4-bd19-90de6e6fafd8',
      algo: 'gbm',
      description: '1k Trees GBM',
      file: 'gb-ef-aggregated-2-gbm-cfcd9d90-108b-42f4-bd19-90de6e6fafd8-1000-trees.csv'  
    },
    {
      id: 'glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5',
      algo: 'glm',
      description: 'GLM',
      file: 'gb-ef-aggregated-2-glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5.csv'  
    }
  ]
}


function combineResiduals(config) {
  //
  // create the a file with all of the residuals for all algos
  //
  const models = config.models;
  const project = config.project;
  const inputPath = `../../local-data/${project}/output`;
  const outputPath = `../../local-data/${project}/output`;
  let combinedData = [];

  models.forEach(model => {
    const csvfile2 = `${inputPath}/${model.file}`;
    const baseData = d3.csv.parse(fs.readFileSync(csvfile2, 'utf8'));

    // add the metadata to each row for convenience later
    baseData.forEach(d => {
      d.modelID = model.id;
      d.algo = model.algo;
      d.description = model.description;
    })

    combinedData = combinedData.concat(baseData);
  })

  outputData = combinedData;
  // write a csv file
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream(`${outputPath}/${config.combinedFilename}`));
  outputData.forEach(d => {
      writer.write(d);
  })
  writer.end();
}

combineResiduals(grupoBimboSmallConfig);