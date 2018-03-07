/*jshint esversion: 6 */

//return max(now - mostRecentSignalLost for each camera)

var Config = require("../lib/FoxMonitorConfig");
var FoxMetrics = require("../lib/FoxVigiMetrics");
var Utils = require("../lib/FoxMonitorUtil");
var _ = require("lodash");

var fx = Config.getFoxXmlInterface();
var conf = Config.getScriptConfig();


function shouldCheckCamera(duration, camId) {
    return !conf || !conf.cameras || conf.cameras[camId + ""] !== false;
}

function printMax(durationNoSignalForCamera) {
    Utils.PrintValueAndExit(_(durationNoSignalForCamera).filter(shouldCheckCamera).values().max(), conf.threshold);
}

FoxMetrics.getDurationWithNoSignal(fx, FoxMetrics.getTimestampForDayStart(-1), FoxMetrics.getTimestampForDayStart(0))
    .then(printMax)
    .catch(Utils.ErrorHandler);