const fetch = require('node-fetch');
const jsonfile = require('jsonfile');

function aggregate(options, frame) {
  const server = options.server;
  const port = options.port;
  const model_id = 'aggregator-b4209a31-b303-4e9d-89b7-cdd11228iu7ip';
  const training_frame = frame;
  const ignored_columns = options.ignoredColumns;
  const ignore_const_cols = 'true';
  const radius_scale = options.radiusScale; // '0.6'; // '0.05'; // '0.005';
  const categorical_encoding = 'AUTO';
  const transform = 'NORMALIZE';
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
        console.log(json);
    });
}

// example
// aggregate(grupoBimboDmitryFeaturesOptions, grupoBimboDmitryFeaturesOptions.combinedFrames.glm);
// aggregate(grupoBimboDmitryFeaturesOptions, grupoBimboDmitryFeaturesOptions.combinedFrames.drf);
aggregate(grupoBimboDmitryFeaturesOptions, grupoBimboDmitryFeaturesOptions.combinedFrames.gbm);