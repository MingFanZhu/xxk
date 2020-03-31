function get_books() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/api?table=xkzp&get=*');
    xhr.onload = function(e) {
        if (xhr.status == 200) {
            var data = xhr.response;
            data = JSON.parse(data);
            for (var line of data) {
                var button = document.createElement('button');
                button.innerHTML = line.zuoping;
                button.classList.add("bookbts");
                button.setAttribute('url', line.url);
                button.id = line.id;
                $('#pages .page:nth-of-type(5) .class[name=' + line.xilie + ']')[0].appendChild(button);
                button.onclick = function() {
                    $('#pages .page:nth-of-type(5) .bookbts').removeClass('selectbt');
                    $(this).addClass("selectbt");
                    window.open($(this)[0].getAttribute('url'));
                }
            }
        }
    };
    xhr.send();
}

function show_search() {
    var search_div = $('#pages .page:nth-of-type(5) .search');
    if (search_div.css('display') == 'none') {
        search_div.css('display', '');
    } else {
        search_div.css('display', 'none');
        var input_objs = $('#pages .page:nth-of-type(5) .input input');
        for (var obj of input_objs) {
            obj.value = '';
        }
    }
}

function radio_change(class_name, near) {
    $('#pages .page:nth-of-type(5) .' + class_name).css('display', 'none');
    var input_objs = $('#pages .page:nth-of-type(5) .' + class_name + ' input');
    for (var obj of input_objs) {
        obj.value = '';
    }
    $('#pages .page:nth-of-type(5) .' + near).css('display', '');
}

function send_post() {
    var input_objs = $('#pages .page:nth-of-type(5) .input input');
    var str = "&";
    for (var obj of input_objs) {
        if (obj.value != '') {
            str += obj.name;
            str += "=" + obj.value;
            break;
        }
    }
    if (str == "&") {
        return;
    }
    $.post('/api?table=xkzp' + str, function(data, status) {
        if (status == 'success') {
            $('#pages .page:nth-of-type(5) .bookbts').removeClass('selectbt');
            if (data == '无结果') {
                return;
            }
            data = JSON.parse(data);
            for (var line of data) {
                $('#pages .page:nth-of-type(5) #' + line.id).addClass('selectbt');
            }
            $('#pages .page:nth-of-type(5) .input input[name=age]')[0].value = data[0].age;
            $('#pages .page:nth-of-type(5) .input input[name=year]')[0].value = data[0].gongli;
        }
    });
}