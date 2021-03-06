/*jshint esversion: 6 */

//return any(analysisActivated for each camera)

var Config = require("../lib/FoxMonitorConfig");
var FoxMetrics = require("../lib/FoxVigiMetrics");
var Utils = require("../lib/FoxMonitorUtil");
var _ = require("lodash");

var fx = Config.getFoxXmlInterface();
var conf = Config.getScriptConfig();

function shouldCheckCamera(camera) {
    return !conf || !conf.cameras || conf.cameras[camera.camid + ""] !== false;
}

function printIfAtAnalysisEnabled(cameraStates) {
    Utils.PrintValueAndExit(_(cameraStates).filter(shouldCheckCamera).some(x => x.analysis === 'on') ? 1: 0);
}

FoxMetrics.getCameraStates(fx)
    .then(printIfAtAnalysisEnabled)
    .catch(Utils.ErrorHandler);