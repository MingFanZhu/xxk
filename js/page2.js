function load_relation() {
    var div = document.querySelector("#pages .page:nth-of-type(2)");
    $.get('../data/relation.json', function (data, status) {
        if (status == 'success') {
            new RelationChart(div, data, {
                width: div.offsetWidth,
                height: div.offsetHeight
            });
        }
    });
}