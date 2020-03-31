var fs = require("fs");
var path = require("path");

var types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".swf": "application/x-shockwave-flash",
    ".tiff": "image/tiff",
    ".txt": "text/plain",
    ".wav": "audio/x-wav",
    ".wma": "audio/x-ms-wma",
    ".wmv": "video/x-ms-wmv",
    ".xml": "text/xml"
}

function route(pathname, res, base_path) {
    if (pathname == "/") {
        pathname = base_path + "/html/徐霞客游记.html";
    } else {
        pathname = base_path + pathname;
    }
    fs.readFile(pathname, function (err, data) {
        if (err) {
            res.writeHead(404, { "content-type": "text/plain" });
            res.write("404");
            res.end();
            console.log("[error]获取资源：" + pathname);
        } else {
            var ext = path.extname(pathname);
            var contenttype = types[ext] || "text/plain";
            res.writeHead(200, { "content-type": contenttype });
            res.write(data);
            res.end();
            console.log("获取资源：" + pathname);
        }
    });
}

exports.route = route;