var map = null;
var markers = new Array();
var infoWin = null;
var coincidencePointsList = new Array();
var changed = false;

function get_index(list, tar) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === tar) {
            return i;
        }
    }
    return -1;
}

function mapLoad() {
    var mapDiv = $('#pages .page:nth-of-type(3) .right')[0];
    map = new AMap.Map(mapDiv, {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 4, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView'], function() {
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
        var scale = new AMap.Scale();
        map.addControl(scale);
        var overView = new AMap.OverView();
        map.addControl(overView);
        overView.open();
    });
    addMarkers();
    makePoints();
    map.on('zoomend', mapZoomend);
}

function addMarkers() {
    var pointsHasSeclect = new Array();
    for (var place of travelPlaceList) {
        var marker = new AMap.Marker({
            map: map,
            position: [place.longitude, place.latitude],
            icon: new AMap.Icon(),
            animation: 'AMAP_ANIMATION_DROP',
            title: place.currentName
        });
        markers.push(marker);
        marker.on('click', function(e) {
            var index = markers.indexOf(e.target);
            var infoWindow = makeInfo(travelPlaceList[index]);
            infoWindow.open(map, e.target.getPosition());
            $('#pages .page:nth-of-type(3) .img')[0].innerHTML = "<img src='" + travelPlaceList[index].imagesUrl + "'>";
            $('#pages .page:nth-of-type(3) .info')[0].innerHTML = travelPlaceList[index].textInfo;
        });
        if (pointsHasSeclect.indexOf(place.ancientName) == -1) {
            pointsHasSeclect.push(place.ancientName);
        } else {
            var index = -1;
            for (var i = 0; i < coincidencePointsList.length; i++) {
                index = coincidencePointsList[i].indexOf(markers[pointsHasSeclect.indexOf(place.ancientName)]);
                if (index != -1) {
                    coincidencePointsList[i].push(marker);
                    break;
                }
            }
            if (index == -1) {
                coincidencePointsList.push([markers[pointsHasSeclect.indexOf(place.ancientName)], marker]);
            }
        }
    }
}

function makeInfo(place) {
    var div = document.createElement("div");
    div.id = "infoWin";
    var but = document.createElement("button");
    but.innerHTML = 'x';
    but.onclick = close;
    var html = "";
    html += "<h3>年龄：" + place.age + "</h3>";
    html += "<p>起止日期：" + place.startTime + "~" + place.endTime + "</p>";
    html += "<p>古称：" + place.ancientName + "  今称：" + place.currentName + "</p>";
    html += "<img src='" + place.imagesUrl + "'>";
    div.innerHTML = html;
    div.append(but);

    var infoWindow = new AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        content: div,
        showShadow: true,
        offset: new AMap.Pixel(10, -20)
    });
    infoWin = infoWindow;
    return infoWindow;
}

function makePoints() {
    var div = $('#inside')[0];
    var html = "";
    for (var place of travelPlaceList) {
        html += "<span>" + place.ancientName + "</span>";
    }
    html = html.slice(0, html.length - 1);
    div.innerHTML = html;
}

function close() {
    infoWin.close();
}

function mapZoomend() {
    var zoom = map.getZoom();
    if (zoom > 9 && changed == false) {
        for (var coinPois of coincidencePointsList) {
            for (var i = 1; i < coinPois.length; i++) {
                coinPois[i].setAngle(i * 60);
            }
        }
        changed = true;
    }
    if (zoom <= 9 && changed == true) {
        for (var coinPois of coincidencePointsList) {
            for (var i = 1; i < coinPois.length; i++) {
                coinPois[i].setAngle(0);
            }
        }
        changed = false;
    }
}