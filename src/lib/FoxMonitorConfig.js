//load conf/conf.json and make it available to scripts needing it
var fs = require("fs");
var path = require("path");
var FoxXml = require("../lib/FoxXmlInterface");

var globalConfiguration = null;

function loadConfiguration() {
    var fullFileLocation = path.join(__dirname, "../../conf/conf.json");
    if (!globalConfiguration)
        globalConfiguration = JSON.parse(fs.readFileSync(fullFileLocation));
}

function getScriptConfig() {
    var currentScriptName = path.basename(process.argv[1], '.js');
    if (currentScriptName && globalConfiguration)
        return globalConfiguration[currentScriptName] || {};

    return {};
}

function getFoxXmlInterface() {
    if (!globalConfiguration || !globalConfiguration.FoxXml)
        throw "Missing FoxXml configuration file";

    return new FoxXml(globalConfiguration.FoxXml.Address, globalConfiguration.FoxXml.Port,
        globalConfiguration.FoxXml.User, globalConfiguration.FoxXml.Password);
}

loadConfiguration();

module.exports.getScriptConfig = getScriptConfig;
module.exports.getFoxXmlInterface = getFoxXmlInterface;