/**
 * Created by alonso on 16/6/10.
 * requirejs 加载入口函数
 */
require.config({
    baseUrl: "js/app",
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        'sidebar': {"deps": ['jquery']}
    },
    paths: {
        'jquery' : '../jquery-1.9.1.min',
        'ol': '../ol3/ol',
        'bootstrap': '../bootstrap/bootstrap.min',
        'sidebar': '../sidebar'
    }
});

require(['jquery', 'ol', 'Z', 'styleUtil', 'sidebar'], function ($, ol, Z, styleUtil) {
    Z.init('map');//初始化地图
    Z.addMousePosition();
    Z.addScaleLine();
    var extent = new ol.extent.applyTransform([102, 29, 124, 31], ol.proj.getTransform("EPSG:4326","EPSG:3857"));
    var sidebar = $('#sidebar').sidebar();
    var vectorWarnSource = new ol.source.Vector();
    var stormWaring = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([114.97, 27.1])),
        name: '暴雪黄色预警'
    });

    stormWaring.setStyle(styleUtil.getStormStyle(stormWaring));
    vectorWarnSource.addFeature(stormWaring);

    var vectorWarnLayer = new ol.layer.Vector({
        source: vectorWarnSource,
        style: styleUtil.getWarnSytle
    });

    Z.map.addLayer(vectorWarnLayer);

    var vectorSource = new ol.source.Vector();
//    vectorSource.addFeature(
//        new ol.Feature({
//            geometry: new ol.geom.Circle(ol.proj.fromLonLat([114.97, 27.1]), 1e5),
//            name: '同心圆'
//        })
//    );

    var lineString = new ol.geom.LineString([[114.97, 27.1], [114.97, 7.1]]).transform('EPSG:4326', 'EPSG:3857');
    vectorSource.addFeature(
        new ol.Feature({
            geometry: lineString ,
            name: '直线'
        })
    );

    var point = new ol.geom.Point(ol.proj.fromLonLat([114.97, 20.1]));
    vectorSource.addFeature(
        new ol.Feature({
            geometry: point,
            name : '点'
        })
    );//添加点

    var polygon = new ol.geom.Polygon([[[120.97, 23.1],[115.97, 15.1],[118.97, 13.1],[120.97, 20.1]]]).transform('EPSG:4326', 'EPSG:3857');
    vectorSource.addFeature(
        new ol.Feature({
            geometry: polygon,
            name : '面'
        })
    );//添加面

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleUtil.getSytle
    });

    Z.map.addLayer(vectorLayer);//添加矢量图层

    /**************************框选************************************/
//    var vectorSource1 = new ol.source.Vector({
//        url: 'js/app/country.geojson',
//        format: new ol.format.GeoJSON()
//    });
//
//    var vectorLayer1 = new ol.layer.Vector({
//        source: vectorSource1
//    });
//
//    Z.map.addLayer(vectorLayer1);
//
//    var select = new ol.interaction.Select();
//    Z.map.addInteraction(select);//设为选定状态
//
//    select.on('select', function () {
//
//    })
//
//    var selectedFeatures = select.getFeatures();
//
//    var dragBox = new ol.interaction.DragBox({
//        condition: ol.events.condition.platformModifierKeyOnly
//    });
//
//    Z.map.addInteraction(dragBox);
//
//    var infoBox = document.getElementById('info');
//
//    dragBox.on('boxend', function() {
//        // features that intersect the box are added to the collection of
//        // selected features, and their names are displayed in the "info"
//        // div
//        var info = [];
//        var extent = dragBox.getGeometry().getExtent();
//        vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
//            selectedFeatures.push(feature);
//            info.push(feature.get('name'));
//        });
//        if (info.length > 0) {
//            infoBox.innerHTML = info.join(', ');
//        }
//    });
//
//    // clear selection when drawing a new box and when clicking on the map
//    dragBox.on('boxstart', function() {
//        selectedFeatures.clear();
//        infoBox.innerHTML = '&nbsp;';
//    });
    //iconFeature.setStyle(iconStyle);
    //vectorSource.addFeature(iconFeature);

    /***********************draw*****************************/
    //初始化绘图控件
    var features = new ol.Collection();
    var source = new ol.source.Vector({wrapX: false, features: features});

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    var modify = new ol.interaction.Modify({
        features: features,
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });
    Z.map.addInteraction(modify);

    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    Z.map.addInteraction(select);

    Z.map.addLayer(vector);//将绘画图层添加至map中

    var getDrawFeatures = function () {
        //获取所绘制图层信息
        var features = source.getFeatures();
        for(var i=0, len=features.length; i<len; i++){
            var feature = features[i];
            //获取feature经纬度
            var geoName = feature.getGeometry().getType();//获取feature类型
            var geometry = feature.getGeometry();
            var coordinates = geometry.getCoordinates();//获取坐标信息
        }
    }

    $("#getDrawFeature").click(function () {
        getDrawFeatures();
    })
    
    /*删除所选feature*/
    $("#deleteFeature").click(function () {
        debugger;
        var selectFeature = select.getFeatures();
        selectFeature.forEach(function (feature) {
            source.removeFeature(feature);
        })

        selectFeature.clear();
        source.refresh();

        //features.clear();//清除画布所有feature
    })

    //绘图
    $("#draw").click(function () {
        var draw = Z.draw("Point", source);//初始化绘制点图层
        $("#type").change(function () {
            Z.map.removeInteraction(draw);
            draw = Z.draw($(this).val(), source);
        })
    })
    
    //添加feature
    $("#addFeature").click(function () {
        var geo = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[114.62036,27.5375],[115.22461,27.415663],[115.669556,26.740705],[114.9884,26.622908],[114.27429,26.95635],[114.62036,27.5375]]]},"properties":null}]}';
        var format = new ol.format.GeoJSON();
        var features = format.readFeatures(geo, {dataProjection:'EPSG:4326', featureProjection: 'EPSG:3857'});

        source.addFeatures(features);
    })

    var circle = new ol.geom.Circle([114.97, 27.1], 1);
    var cFeature = new ol.Feature({
        geometry: circle,
        name: 'circle'
    });

    $("#getCircle").click(function () {
        var format = new ol.format.GeoJSON();
        var polygon = ol.geom.Polygon.fromCircle(circle)
        var _f = new ol.Feature({
            geometry: polygon,
            name: 'My Polygon'
        });
        var geojson = format.writeFeature(_f);
        alert(geojson);

        source.addFeature(_f);
    })
})