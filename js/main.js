window.onload = function() {
    set_css();
    $('#menu a').on("click", function() {
        $('#menu a').removeClass("select");
        $('.page').css({
            'z-index': '-1',
            'opacity': '0'
        });
        $(this).addClass("select");
        var as = $('#menu a');
        var index = get_index(as, this) + 1;
        $('.page:nth-of-type(' + index + ')').css({
            'z-index': '10',
            'opacity': '1'
        });
    });
    $('#pages .page:nth-of-type(3) .place span').on("click", function() {
        var index = $(this).index();
        map.setCenter([travelPlaceList[index].longitude, travelPlaceList[index].latitude]);
        map.setZoom(11);
        $('#pages .page:nth-of-type(3) .img')[0].innerHTML = "<img src='" + travelPlaceList[index].imagesUrl + "'>";
        $('#pages .page:nth-of-type(3) .info')[0].innerHTML = travelPlaceList[index].textInfo;
    });
    $('#menu ul li:nth-of-type(2) a').one("click", load_relation);
    $('#menu ul li:nth-of-type(5) a').one("click", get_books);
    $('#menu ul li:nth-of-type(4) a').one("click", get_poems);
    $('#menu a')[0].click();
    readWorkbookFromRemoteFile('../data/徐霞客年谱.xlsx', function(workbook) {
        var sheetNames = workbook.SheetNames; // 工作表名称集合
        var worksheet = workbook.Sheets[sheetNames[0]]; // 只读取第一张sheet
        var csv = XLSX.utils.sheet_to_csv(worksheet);
        var lines = csv.split('\n');
        lines.pop();
        //动态生成表格
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        for (var i = 0; i < lines.length; i++) {
            var tr = tbody.insertRow(tbody.rows.length);
            var vals = lines[i].split(',');
            for (var j = 0; j < vals.length; j++) {
                var th = document.createElement("th");
                th.innerHTML = vals[j];
                tr.appendChild(th);
            }
        }
        $('#pages .page:nth-of-type(1) .down .table')[0].appendChild(table);
    });
}

function set_css() {
    var hei = window.innerHeight;
    document.getElementById('container').style.height = hei + 'px';
    $('#pages').css('height', String(hei - $('#menu').offset().top - $('#menu').height() - $('#foot').height() - 20) + 'px');
    mapLoad();
    hei = $('#pages .page:nth-of-type(1) .down').height();
    $('#pages .page:nth-of-type(1) .down .table').css('height', String(hei - $('#pages .page:nth-of-type(1) .down h2').height()));
    $('#pages .page:nth-of-type(6) .container').css('height', String($('#pages .page:nth-of-type(6)').height() - $('#pages .page:nth-of-type(6) h2').height()))
    var width = window.innerWidth;
    var scale = width / 1920;
    $('#pages .page:nth-of-type(1) .up .description').css('font-size', '' + 16 * scale + 'px');
}