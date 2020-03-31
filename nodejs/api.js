var mysql = require('mysql');
var format = require('string-format')
var connection = null;
var selectSQL = "select * from xxk.{} where {} = '{}'";

//连接以及重连
function handleError(err) {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            console.error(err.stack || err);
        }
    }
}

function connect() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '31415926',
        database: 'xxk'
    });
    connection.connect(handleError);
    connection.on('error', handleError);
}
connect();

function search(path, res) {
    path = path.split('?')[1];
    path = path.split('&');
    var table = path[0].split('=')[1];
    var key = path[1].split('=')[0];
    var value = path[1].split('=')[1];
    if (value == '*') {
        sql(format('select * from xxk.{}', table), function (data) {
            send_data(data, res);
        });
    } else {
        switch (key) {
            case 'diming':
                sql(format(selectSQL, table, 'gudiming', value), function (data) {
                    if (data == -1) {
                        sql(format(selectSQL, table, 'jindiming', value), function (data) {
                            send_data(data, res);
                        });
                    } else {
                        send_data(data, res);
                    }
                });
                break;
            case 'age':
                sql(format(selectSQL, table, key, value), function (data) {
                    send_data(data, res);
                });
                break;
            default:
                sql(format(selectSQL, table, 'gongli', value), function (data) {
                    if (data == -1) {
                        sql(format(selectSQL, table, 'nongli', value), function (data) {
                            send_data(data, res);
                        });
                    } else {
                        send_data(data, res);
                    }
                });
        }
    }
}

function sql(sql_str, callback) {
    connection.query(sql_str, function (error, result) {
        if (error) {
            console.log('[select error]', error.message);
        } else {
            if (result.length == 0) {
                return callback(-1);
            } else {
                return callback(result);
            }
        }
    });
}

function send_data(data, res) {
    if (data == -1) {
        res.writeHead(200, { "content-type": "text/plain" });
        res.write('无结果');
        res.end();
        return;
    }
    data = JSON.stringify(data);
    res.writeHead(200, { "content-type": "text/plain" });
    res.write(data);
    res.end();
}

exports.search = search;