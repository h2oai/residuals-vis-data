## data tasks
where GHI = Github Issue Created

DONE + show deviances from h2o-3 as calculated by @arno's code
  (instead of simple residuals)
  [API implementation](https://github.com/h2oai/h2o-3/blob/f610c394cef2942738abf7bba048e43d2335ef62/h2o-core/src/main/java/water/api/ModelMetricsHandler.java)
DONE + read in config from scripts, append new information to it, and write back out config to be used for the next step
GHI + get variable importance directly from the h2o-3 REST API
GHI + cleanup intermediate data frames with scripts
GHI + make combine-frames work for multiple models with one call
GHI + make combine-frames work from a config file and emit a config file
GHI + chain 
GHI   predict
GHI   combine-frames
GHI   aggregate
GHI   together in one script