const fetch = require('node-fetch');
const jsonfile = require('jsonfile');

const grupoBimboWeekSplitOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  modelIDs: [
    'glm-d7208b6f-ae13-4996-8c10-6be359f3e2ae',
    'drf-b08c3eed-0806-4e41-b8f2-4b1d18812af0',
    'gbm-a6210942-fe85-4709-b513-576351f70400'
  ],
  validationFrame: 'validation.hex',
  predictionFrames: {
    'glm': 'predictions_8564_glm-d7208b6f-ae13-4996-8c10-6be359f3e2ae_on_validation.hex',
    'drf': 'predictions_9b49_drf-b08c3eed-0806-4e41-b8f2-4b1d18812af0_on_validation.hex',
    'gbm': 'predictions_8182_gbm-a6210942-fe85-4709-b513-576351f70400_on_validation.hex'
  },
  deviancesFrames: {
    'glm': 'deviances_b3a1_glm-d7208b6f-ae13-4996-8c10-6be359f3e2ae_on_validation.hex',
    'drf': 'deviances_aebb_drf-b08c3eed-0806-4e41-b8f2-4b1d18812af0_on_validation.hex',
    'gbm': 'deviances_ba64_gbm-a6210942-fe85-4709-b513-576351f70400_on_validation.hex'
  }
};

const grupoBimboDmitryFeaturesOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  validationFrame: 'Bimbo_valid_processed.hex',
  modelIDs: [
    'drf-460f78d7-e5e3-4ea7-8a08-b877de724119',
    'gbm-9a8e7868-3689-4f51-bdc6-5ea068478094',
    'glm-2e52c7c0-dd22-4e76-8372-c2cbb7dd0141'
  ],
  predictionFrames: {
    'glm': 'predictions_b4e1_glm-2e52c7c0-dd22-4e76-8372-c2cbb7dd0141_on_Bimbo_valid_processed.hex',
    'drf': 'predictions_99ce_drf-460f78d7-e5e3-4ea7-8a08-b877de724119_on_Bimbo_valid_processed.hex',
    'gbm': 'predictions_9948_gbm-9a8e7868-3689-4f51-bdc6-5ea068478094_on_Bimbo_valid_processed.hex'
  },
  deviancesFrames: {
    'glm': 'deviances_8f59_glm-2e52c7c0-dd22-4e76-8372-c2cbb7dd0141_on_Bimbo_valid_processed.hex',
    'drf': 'deviances_86b2_drf-460f78d7-e5e3-4ea7-8a08-b877de724119_on_Bimbo_valid_processed.hex',
    'gbm': 'deviances_8053_gbm-9a8e7868-3689-4f51-bdc6-5ea068478094_on_Bimbo_valid_processed.hex'
  }
};

function combineFrames(options, ...args) {
  console.log('args', args);
  const frameIDs = args;
  const a = frameIDs[0];
  const b = frameIDs[1];
  const server = options.server;
  const port = options.port;
  const combinedFrameKey = `combined-${a}-${b}`;
  const rapidsExpression = `(assign ${combinedFrameKey} (cbind ${a} ${b}))`
  const fetchOptions = { 
    method: 'POST',
    body: `ast=${rapidsExpression}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  fetch(`${server}:${port}/99/Rapids`, fetchOptions)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
        if (frameIDs.length > 2) {
          let newFrameIDs = [];
          const remainingFrameIDs = frameIDs.slice(2,frameIDs.length);
          console.log('remainingFrameIDs', remainingFrameIDs);
          newFrameIDs.push(combinedFrameKey);
          newFrameIDs = newFrameIDs.concat(remainingFrameIDs);
          console.log('newFrameIDs', newFrameIDs);

          // recursion!
          combineFrames(options, ...newFrameIDs);
        }
    });
}


// combineFrames('valid_rossman_frame_0.250', 'predictions_8174_glm-07e61c42-9e3d-40bd-a288-60b76a53e91e_on_valid_rossman_frame_0.250', rossmanOptions);
// combineFrames('combined-valid_rossman_frame_0.250-predictions_8174_glm-07e61c42-9e3d-40bd-a288-60b76a53e91e_on_valid_rossman_frame_0.250', 'deviances_8586_glm-07e61c42-9e3d-40bd-a288-60b76a53e91e_on_valid_rossman_frame_0.250', rossmanOptions);

const validationFrame = grupoBimboDmitryFeaturesOptions.validationFrame;
const predictionFrame = grupoBimboDmitryFeaturesOptions.predictionFrames.gbm;
const deviancesFrame  = grupoBimboDmitryFeaturesOptions.deviancesFrames.gbm;

combineFrames(grupoBimboDmitryFeaturesOptions, validationFrame, predictionFrame, deviancesFrame);