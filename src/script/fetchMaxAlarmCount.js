/*jshint esversion: 6 */

//return max(alarmCountForYesterday for each camera)

var Config = require("../lib/FoxMonitorConfig");
var FoxMetrics = require("../lib/FoxVigiMetrics");
var Utils = require("../lib/FoxMonitorUtil");
var _ = require("lodash");

var fx = Config.getFoxXmlInterface();
var conf = Config.getScriptConfig();

function shouldCheckCamera(idxList, camId) {
    return !conf || !conf.cameras || conf.cameras[camId + ""] !== false;
}

function computeMaxAlarmPerCamera(alarmsPerCamera) {
    return alarmsPerCamera ? _(alarmsPerCamera).filter(shouldCheckCamera).mapValues("length").values().max() : 0;
}

function printMax(alarmsPerCamera) {
    Utils.PrintValueAndExit(computeMaxAlarmPerCamera(alarmsPerCamera), conf.threshold);
}

FoxMetrics.getAlarmsForCameras(fx, FoxMetrics.getTimestampForDayStart(-1), FoxMetrics.getTimestampForDayStart(0))
    .then(printMax)
    .catch(Utils.ErrorHandler);