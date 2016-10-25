const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const fs = require('fs');
const _ = require('lodash');

const configFile = 'wineOptions.json';
let outputOptions;

const filePath = `../config/${configFile}`;
fs.readFile(filePath, 'utf8', callback);
function callback(error, data) {
  const config = JSON.parse(data);  
  outputOptions = _.cloneDeep(config);
  if (typeof outputOptions.combinedFrames === 'undefined') {
    outputOptions.combinedFrames = {};
  }
  config.frameIDs = {};
  // create an array of frameIDs for each model
  config.modelIDs.forEach(modelID => {
    // combine the validation frame last since it is usually
    // the largest
    config.frameIDs[modelID] = [];
    config.frameIDs[modelID][0] = config.predictionFrames[modelID];
    config.frameIDs[modelID][1] = config.deviancesFrames[modelID];
    config.frameIDs[modelID][2] = config.validationFrame;
  })
  combineFrames(config);
}

function combineFrames(options) {
  // console.log('options from combineFrames', options);
  console.log('combineFrames was called');
  const modelIDs = options.modelIDs;
  const currentModelID = modelIDs[0];
  console.log(`${options.frameIDs[currentModelID].length} frameIDs currently`);

  const server = options.server;
  const port = options.port;
  const a = options.frameIDs[currentModelID][0];
  const b = options.frameIDs[currentModelID][1]; 
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
        // console.log(json);
        if (
          typeof currentModelID !== 'undefined' &&
          options.frameIDs[currentModelID].length > 2
        ) {
          // there are more frames to combine for the current model
          let newFrameIDs = [];

          // remove the two frameIDs we just combined
          const remainingFrameIDs = options.frameIDs[currentModelID].slice(2, options.frameIDs[currentModelID].length);
          console.log('remainingFrameIDs', remainingFrameIDs);

          // add the frameID of the new combined frame we just created
          newFrameIDs.push(combinedFrameKey);
          newFrameIDs = newFrameIDs.concat(remainingFrameIDs);
          console.log('newFrameIDs', newFrameIDs);
          options.frameIDs[currentModelID] = newFrameIDs;

          // recursion!
          combineFrames(options);
        // } else if (
        //   typeof options.modelIDs !== 'undefined' && 
        //   options.modelIDs.length > 0
        // ) {
        } else {
          // all frames are combined for the model
          // but there are more models, so combine again

          // add the final combined frame for this model
          // to the config that we emit
          outputOptions.combinedFrames[currentModelID] = combinedFrameKey;
          
          // remove the current model
          options.modelIDs = options.modelIDs.slice(1, options.modelIDs.length);
          console.log('options.modelIDs', options.modelIDs);

          if (options.modelIDs.length > 0) {
            // call again to combine frames for remaining models
            combineFrames(options)
          } else {
            // there are no more frames to combine for the current model
            // and there are no more models to combine frames for
            // so now,
            // write out the config
            // with the combinedFrames for each model
            // 
            // this will overwrite our old config file
            // that is ok 😀
            const outputJsonObj = outputOptions;
            const outputFile = filePath;
            jsonfile.writeFile(outputFile, outputJsonObj, {spaces: 2}, function(err){
              console.log(err)
              console.log(`wrote ${outputFile} with IDs for ${Object.keys(outputOptions.combinedFrames).length} combined`);
              console.log(`validation data, predictions, and deviances frames`);
            })
          }
        } 
    });
}
