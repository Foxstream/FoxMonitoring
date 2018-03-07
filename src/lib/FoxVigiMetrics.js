/*jshint esversion: 6 */
var moment = require("moment");
var _ = require("lodash");

const AlarmIndexType = 1003;
const AlarmTechIndexType = 1011;

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

function getCameraList(foxXmlClient) {
    return foxXmlClient.fetchSystemConfiguration().then(obj => _.map(obj.camera, "$"));
}

function extractDurationFromIndex(index) {
    const simpleIndex = _.get(index, 'singleindex[0].$');
    const now = moment().unix();
    const delta = simpleIndex ? now - simpleIndex.startdate : 0;

    return { id: simpleIndex.camid, duration: delta };
}

function getNoSignalDurationForCamera(foxXmlClient, camState) {
    var duration = 0;
    if (camState.$.signal === "on")
        return { id: camState.$.camid, duration: 0 };
    else
        return foxXmlClient.fetchLastIndex(camState.$.camid, AlarmTechIndexType).then(extractDurationFromIndex);
}

function iterateStatesToGetSignalDuration(foxXmlClient, states) {
    var durationNoSignal = _.map(states.camera, getNoSignalDurationForCamera.bind(null, foxXmlClient));
    var extractIdFromObject = (o, x) => _.set(o, x.id, x.duration);

    return Promise.all(durationNoSignal).then(
        x => _.reduce(x, extractIdFromObject, {})
    );
}

function getDurationWithNoSignal(foxXmlClient) {
    return foxXmlClient.fetchState().then(iterateStatesToGetSignalDuration.bind(null, foxXmlClient));
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
module.exports.getCameraList = getCameraList;
module.exports.getDurationWithNoSignal = getDurationWithNoSignal;