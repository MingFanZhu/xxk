var server = require("./nodejs/server");
var router = require("./nodejs/router");

var base_path = __dirname.replace(/\\/g, "/");
server.start(router.route, base_path);
