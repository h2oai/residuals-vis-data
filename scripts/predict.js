const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const fs = require('fs');
const _ = require('lodash');

const rossmanOptions = {
  server: 'http://172.16.2.27',
  port: '54321',
  modelIDs: [
    'deeplearning-a2a9fef1-10d0-4cfb-a8dd-96e99dca161c'
  ],
  project: 'rossman-store-sales'
};

const grupoBimboNaiveOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  validationFrame: 'gb_validation_frame_0.250',
  modelIDs: [
    'glm-f52fe8cb-3aad-4eb0-b0cb-36ec16ae58a3',
    'drf-c6daf49d-dd1f-43b8-9eeb-99bb828d2a25',
    'gbm-ef176351-e583-4484-9a08-0f47dc10d4e1',
    'deeplearning-a9e4ccaf-8387-49fe-964e-6473284c67ff'
  ]
};

const grupoBimboWeekSplitOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  validationFrame: 'validation.hex',
  modelIDs: [
    'glm-d7208b6f-ae13-4996-8c10-6be359f3e2ae',
    'drf-b08c3eed-0806-4e41-b8f2-4b1d18812af0',
    'gbm-a6210942-fe85-4709-b513-576351f70400'
  ]
};

const grupoBimboDmitryFeaturesOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  validationFrame: 'Bimbo_valid_processed1.hex',
  modelIDs: [
    'gbm-3aaad580-3abc-4876-b4dc-4730b11d2388',
    'drf-c70bb027-a911-4f67-a754-bb25c31f7ae8',
    'gbm-6453814e-3bfb-4764-b409-b29787447183',
    'glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5',
  ]
};

const configFile = 'grupoBimboDmitryFeaturesOptions.json';
let outputOptions;

const filePath = `../config/${configFile}`;
fs.readFile(filePath, 'utf8', callback);
function callback(error, data) {
  const config = JSON.parse(data);  
  outputOptions = _.cloneDeep(config);
  outputOptions.predictionFrames = {};
  outputOptions.deviancesFrames = {};
  predict(config);
}

function predict(options) {
  const modelIDs = options.modelIDs;
  const model = modelIDs[0];
  const validationFrame = options.validationFrame;
  const server = options.server;
  const port = options.port;
  const fetchOptions = { 
    method: 'POST',
    body: 'deviances=true',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  console.log(`generating predictions from model ${model} on validation frame ${validationFrame}`);
  fetch(`${server}:${port}/3/Predictions/models/${model}/frames/${validationFrame}`, fetchOptions)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
        outputOptions.predictionFrames[model] = json.predictions_frame.name;
        outputOptions.deviancesFrames[model] =  json.deviances_frame.name;

        if (modelIDs.length > 1) {
          // if there are more models, predict again
          let remainingModelIDs = modelIDs.slice(1,modelIDs.length);
          const newOptions = {
            server: options.server,
            port: options.port,
            validationFrame: options.validationFrame,
            modelIDs: remainingModelIDs
          }
          // recursion!
          predict(newOptions);
        } else {
          // if not, write out the accumulated 
          // predictionFrames and deviancesFrames
          // to our new config file
          // this will overwrite our old config file
          // that is ok
          const outputJsonObj = outputOptions;
          const outputFile = filePath;
          jsonfile.writeFile(outputFile, outputJsonObj, {spaces: 2}, function(err){
            console.log(err)
          })
        }
    });
}
