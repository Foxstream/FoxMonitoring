/*jshint esversion: 6 */
var FoxXml = require("../lib/FoxXmlInterface");
var FoxMetrics = require("../lib/FoxVigiMetrics");
var _ = require("lodash");

var fx = new FoxXml("192.168.0.118", 4000, "a", "a");

function printMax(alarmsPerCamera) {
    if (!alarmsPerCamera)
        console.log("0");
    else {

        console.log(_(alarmsPerCamera).mapValues("length").values().max());
    }
}

FoxMetrics.getAlarmsForCameras(fx, FoxMetrics.getTimestampForDayStart(-1), FoxMetrics.getTimestampForDayStart(0))
    .then(printMax)
    .catch(err => console.error(err));