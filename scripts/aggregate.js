const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const fs = require('fs');
const _ = require('lodash');

const configFile = 'synthDataOptions.json'
let outputOptions;

const filePath = `../config/${configFile}`;
fs.readFile(filePath, 'utf8', callback);
function callback(error, data) {
  const config = JSON.parse(data);
  outputOptions = _.cloneDeep(config);
  aggregate(config);
}

function aggregate(options) {
  console.log('aggregate was called');
  const server = options.server;
  const port = options.port;
  const model_id = `aggregator-on-${options.frame}`;
  const training_frame = options.frame;
  console.log('training_frame to be aggregated', training_frame);
  const ignore_const_cols = 'true';
  const radius_scale = options.radiusScale; // '0.6'; // '0.05'; // '0.005';
  const categorical_encoding = 'AUTO';
  const transform = 'NORMALIZE';

  // an array
  const ignoredColumns = options.ignoredColumns;
  // a string that we build from the array
  // to match the format h2o-3 REST API expects
  // for the ignored_columns parameter
  let ignored_columns = '[';
  ignoredColumns.forEach((d, i) => {
    ignored_columns += `"${d}"`;
    if (i < (ignoredColumns.length - 1)) {
      ignored_columns += ',';
    }
  })
  ignored_columns += ']';
  console.log('ignored_columns', ignored_columns);

  const fetchOptions = { 
    method: 'POST',
    body: `model_id=${model_id}&training_frame=${training_frame}&ignored_columns=${ignored_columns}&ignore_const_cols=${ignore_const_cols}&radius_scale=${radius_scale}&categorical_encoding=${categorical_encoding}&transform=${transform}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  // 
  fetch(`${server}:${port}/99/ModelBuilders/aggregator`, fetchOptions)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        // console.log(json);

        // get the rowCount for the new aggregated frame

        // if the rowCount is within the desired range,
        // stop and log out the modelID and output frameID

        // if the rowCount is not within the desired range,
        // adjust the radiusScale and train another aggregator model
    });
}
