/*
*
* */
define('Z', ['ol', 'styleUtil'], function (ol, styleUtil) {
    // google地图层
    var googleMapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url:'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
        })
    });

    //百度地图
    // 自定义分辨率和瓦片坐标系
    var resolutions = [];
    var maxZoom = 18;

    // 计算百度使用的分辨率
    for(var i=0; i<=maxZoom; i++){
        resolutions[i] = Math.pow(2, maxZoom-i);
    }
    var tilegrid  = new ol.tilegrid.TileGrid({
        origin: [0,0],    // 设置原点坐标
        resolutions: resolutions  // 设置分辨率
    });

    // 创建百度地图的数据源
    var baiduSource = new ol.source.TileImage({
        projection: 'EPSG:3857',
        tileGrid: tilegrid,
        tileUrlFunction: function(tileCoord, pixelRatio, proj){
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if(x<0){
                x = 'M' + (-x);
            }
            if(y<0){
                y = 'M' + (-y);
            }

            return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20160426&scaler=1&p=0";
        }
    });

    var baiduMapLayer2 = new ol.layer.Tile({
        source: baiduSource
    });

    var Z = {
        map: {},
        tilelayer: {},
        defZoom: 6,
        defCenter: [114.97, 27.1],
        extent: [102, 29, 124, 31],
        init: function (mapDiv) {
            this.map = new ol.Map({
                controls: ol.control.defaults().extend([
                    new ol.control.FullScreen()
                ]),
                target: mapDiv,
                logo: false,
                layers: [
//                    new ol.layer.Tile({
//                        source: new ol.source.MapQuest({layer: 'sat'})
//                    })
                    googleMapLayer
                    //baiduMapLayer2
                ],
                view: new ol.View({
                    // 设置地图中心范围
                    //extent:  new ol.extent.applyTransform(this.extent, ol.proj.getTransform("EPSG:4326","EPSG:3857")),
                    center: ol.proj.fromLonLat(this.defCenter),
                    zoom: this.defZoom
                })
            })
        },
        addMousePosition: function(){//添加经纬度信息
            var mousePosition = new ol.control.MousePosition({
                //undefinedHTML: 'outside',
                projection: 'EPSG:4326',
                target: 'location',
                coordinateFormat: function(coordinate) {
                    return ol.coordinate.format(coordinate, '经度:{x}°, 纬度:{y}°', 2);
                }
            })

            this.map.addControl(mousePosition);//添加鼠标位置
        },
        addScaleLine : function () {//添加比例尺
            var scaleLine = new ol.control.ScaleLine({
                target: 'scaleline'
                //units: 'degrees'
            });
            this.map.addControl(scaleLine);
        },
        draw: function (value, source) {
            if (value !== 'None') {
                var geometryFunction = null;
                var maxPoints = null;
                if (value === 'Square') {
                    value = 'Circle';
                    geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
                } else if (value === 'Box') {
                    value = 'LineString';
                    maxPoints = 2;
                    geometryFunction = function(coordinates, geometry) {
                        if (!geometry) {
                            geometry = new ol.geom.Polygon(null);
                        }
                        var start = coordinates[0];
                        var end = coordinates[1];
                        geometry.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[1]], start]
                        ]);
                        return geometry;
                    };
                }

                var draw = new ol.interaction.Draw({
                    source: source,
                    type: /** @type {ol.geom.GeometryType} */ (value),
                    geometryFunction: geometryFunction,
                    maxPoints: maxPoints
                });
                this.map.addInteraction(draw);

                return draw;
            }
        }
    }

    return Z;
})