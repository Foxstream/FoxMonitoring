/*jshint esversion: 6 */
var Config = require("../lib/FoxMonitorConfig");
var FoxMetrics = require("../lib/FoxVigiMetrics");
var Utils = require("../lib/FoxMonitorUtil");
var _ = require("lodash");

var fx = Config.getFoxXmlInterface();
var conf = Config.getScriptConfig();

function shouldCheckCamera(idxList, camId) {
    return !conf || !conf.cameras || conf.cameras[camId + ""] !== false;
}

function computeTotalAlarms(alarmsPerCamera) {
    return alarmsPerCamera ? _(alarmsPerCamera).filter(shouldCheckCamera).mapValues("length").values().sum() : 0;
}

function computeAvgAlarmCount(totalAlarmCount) {
    return FoxMetrics.getCameraList(fx).then(
        camList => totalAlarmCount / _(camList).map("camid").filter(shouldCheckCamera.bind(null, null)).size()
    );
}

FoxMetrics.getAlarmsForCameras(fx, FoxMetrics.getTimestampForDayStart(-1), FoxMetrics.getTimestampForDayStart(0))
    .then(computeTotalAlarms)
    .then(computeAvgAlarmCount)
    .then(avgAlarm => Utils.PrintValueAndExit(avgAlarm, conf.threshold))
    .catch(Utils.ErrorHandler);