/*jshint esversion: 6 */
var NetSend = require("./NetworkInterface");
var xml2js = require('xml2js');
var { promisify } = require('util');
var _ = require("lodash");

var xmlBuilder = new xml2js.Builder({ explicitRoot: false, headless: true });
var xmlParser = promisify(xml2js.parseString);

function buildBaseMessage(type, rootAttr) {
    var obj = { "fox": { $: { "type": type } } };
    _.assign(obj.fox.$, rootAttr);

    return obj;
}

function getAuthenticatedObj(user, pass) {
    return buildBaseMessage("auth", { "user": user, "pass": pass, "appli": "FoxMonitoring" });
}

function getByeObj() {
    return buildBaseMessage("bye");
}

//remove first and last element from the list
function removeAuthAndBye(elemList) {
    return _.slice(elemList, 1, elemList.length - 1);
}

function encapsulateMessage(obj) {
    var elements = [
        getAuthenticatedObj(this.user, this.pass),
        obj,
        getByeObj()
    ];

    return _(elements).
    map(xmlBuilder.buildObject.bind(xmlBuilder)).
    join("");
}

function checkForErrors(responseList) {
    var firstError = _.find(responseList, { $: { 'type': 'error' } });
    if (firstError) {
        throw { "type": "FoxXml error", "Message": firstError._ };
    }
}

function parseResponse(xmlResponse) {
    return xmlParser("<root>" + xmlResponse + "</root>").then(
        function(data) {
            var responseList = data.root.fox;

            if (responseList.length <= 2)
                throw {
                    "type": "FoxXml error",
                    "Message": "Invalid FoxXml response"
                };
            checkForErrors(responseList);

            return removeAuthAndBye(responseList);
        }
    );
}

//send multiple messages and returns an array of objects
function sendMessages(msg) {
    var xml = this.encapsulateMessage(msg);

    return NetSend(this.addr, this.port, xml).
    then(parseResponse);
}

function sendMessage(msg) {
    return this.sendMessages(msg).
    then(x => x[0]);
}

function fetchSystemConfiguration() {
    return this.sendMessage(buildBaseMessage("config"));
}

function fetchLastIndex(camId, indexType) {
    var queryElement = {
        camid: camId,
        lastnb: 1,
        indextype: indexType,
    };

    return this.sendMessage(buildBaseMessage("index", queryElement));
}

function fetchIndexes(beginTimestamp, endTimestamp, indexType) {
    var queryElement = {
        startdate: beginTimestamp,
        enddate: endTimestamp,
        indextype: indexType,
    };

    return this.sendMessage(buildBaseMessage("index", queryElement));
}

function fetchState() {
    return this.sendMessage(buildBaseMessage("state"));
}

module.exports = function(addr, port, user, pass) {
    this.addr = addr;
    this.port = port;
    this.user = user;
    this.pass = pass;

    this.fetchSystemConfiguration = fetchSystemConfiguration;
    this.fetchIndexes = fetchIndexes;
    this.fetchLastIndex = fetchLastIndex;
    this.fetchState = fetchState;

    //private functions
    this.sendMessage = sendMessage;
    this.sendMessages = sendMessages;
    this.encapsulateMessage = encapsulateMessage;
};