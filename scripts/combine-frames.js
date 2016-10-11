const fetch = require('node-fetch');
const jsonfile = require('jsonfile');

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