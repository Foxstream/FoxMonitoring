/*jshint esversion: 6 */
var moment = require("moment");
var _ = require("lodash");

const AlarmIndexType = 1003;

function groupIndexByCamera(indexList) {
    return _(indexList).
    map(x => x.$).
    groupBy('camid').
    value();
}

//return index list grouped by cameras
function getAlarmsForCameras(foxXmlClient, beginTimestamp, endTimestamp) {
    return foxXmlClient.fetchIndexes(beginTimestamp, endTimestamp, AlarmIndexType).then(
        obj => groupIndexByCamera(obj.singleindex)
    );
}

//local timezone
//if relVal==0, returns midnight
//if relVal==-1, returns yesterday midnight
//if relVal==1, returns tomorrow midnight
function getTimestampForDayStart(relDayToToday) {
    return moment().startOf('day').add(relDayToToday, "days").unix();
}

module.exports.getAlarmsForCameras = getAlarmsForCameras;
module.exports.getTimestampForDayStart = getTimestampForDayStart;