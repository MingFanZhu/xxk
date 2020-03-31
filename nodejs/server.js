var http = require("http");
var url = require("url");
var api=require("../nodejs/api")

function start(route, base_path) {
  function onRequest(request, response) {
    request.url = decodeURI(request.url);
    if (request.url.indexOf('api') != -1) {
      api.search(request.url,response);
    } else {
      var pathname = url.parse(request.url, true).pathname;
      route(pathname, response, base_path);
    }
  }

  http.createServer(onRequest).listen(8086);
  console.log("服务开启，端口号：8086");
}

exports.start = start;
