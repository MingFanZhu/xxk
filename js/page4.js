function get_poems() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/api?table=xksw&get=*');
    xhr.onload = function (e) {
        if (xhr.status == 200) {
            var data = xhr.response;
            data = JSON.parse(data);
            for (var line of data) {
                var div = document.createElement('div');
                div.classList.add("poem");
                var span = document.createElement('span');
                span.innerHTML = line.name;
                span.setAttribute('url', line.url);
                div.appendChild(span);
                var body = document.createElement('div');
                var contain = line.contain;
                contain = contain.replace(/。/g, "。<br>");
                body.innerHTML = contain;
                div.appendChild(body)
                $('#pages .page:nth-of-type(4) .container')[0].appendChild(div);
                span.onclick = function () {
                    $('#pages .page:nth-of-type(5) .poem span').removeClass('selectsp');
                    $(this).addClass("selectsp");
                    window.open($(this)[0].getAttribute('url'));
                }
            }
            itemWaterfull();
        }
    };
    xhr.send();
}

function itemWaterfull() {
    var margin = 15; 
    var items = $("#pages .page:nth-of-type(4) .poem");
    var item_width = items[0].offsetWidth + margin;
    $("#pages .page:nth-of-type(4) .container").css("padding", "0"); 
    var container_width = $("#pages .page:nth-of-type(4) .container")[0].offsetWidth;
    var n = parseInt(container_width / item_width); 
    var container_padding = (container_width - (n * item_width)) / 2; 
    $("#pages .page:nth-of-type(4) .container").css("padding", "0 " + container_padding + "px");
    function findMinIndex(arr) {
        var len = arr.length,
            min = 999999,
            index = -1;
        for (var i = 0; i < len; i++) {
            if (min > arr[i]) {
                min = arr[i];
                index = i;
            }
        }
        return index;
    }
    function putItem() {
        var items_height = []; 
        var len = items.length; 
        for (var i = 0; i < len; i++) {
            var item_height = items[i].offsetHeight; 
            if (i < n) {
                items_height[i] = item_height; 
                items.eq(i).css("top", 5);
                items.eq(i).css("left", i * item_width);

            } else { 
                var min_index = findMinIndex(items_height); 
                if (min_index == -1) {
                    console.log("高度计算出现错误");
                    return;
                }
                items.eq(i).css("top", items_height[min_index] + margin);
                items.eq(i).css("left", min_index * item_width);
                items_height[min_index] += item_height + margin; 
            }
        }
        var max_height = Math.max.apply(null, items_height);
        $("#pages .page:nth-of-type(4) .container").css("height", max_height); 
    }
    putItem();
}
window.onresize = function () {
    itemWaterfull();
};
