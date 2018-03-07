/*jshint esversion: 6 */
var net = require('net');

//return a promise of string
module.exports = function(addr, port, msg) {
    return new Promise(function(resolve, reject) {

        var rcvdata = "";
        var client = new net.Socket();
        var forceClose = setTimeout(
            function() {
                rcvdata = null;
                client.destroy();
            }, 10000);

        client.on('data', function(data) {
            rcvdata += data.toString("utf8");
        });

        client.on('close', function() {
            clearTimeout(forceClose);
            if (rcvdata)
                resolve(rcvdata);
            else
                reject("Timed out");
        });

        client.on('error', function(err) {
            reject(err);
        });

        client.connect(port, addr, function() {
            client.write(Buffer.from(msg));
        });
    });
};