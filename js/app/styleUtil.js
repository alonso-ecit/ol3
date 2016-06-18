define('styleUtil', ['ol'], function (ol) {
//    var image = new ol.style.Circle({
//        radius: 5,
//        fill: null,
//        stroke: new ol.style.Stroke({color: 'red', width: 1})
//    });

    var image = new ol.style.Icon(({
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'images/dot.png'
    }))

    var styles = {
        'Point': new ol.style.Style({
            image: image
        }),
            'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        }),
            'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        }),
            'MultiPoint': new ol.style.Style({
            image: image
        }),
            'MultiPolygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.1)'
            })
        }),
            'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        }),
            'GeometryCollection': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'magenta',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'magenta'
            }),
            image: new ol.style.Circle({
                radius: 10,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: 'magenta'
                })
            })
        }),
            'Circle': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.2)'
            })
        })
    };

    var getStyle = function (feature) {
        return styles[feature.getGeometry().getType()];
    };

    var getWarnSytle = function (feature) {
        var src = 'images/';
        if(feature.get('name') == '暴雪黄色预警'){
            src += '1.png';
        } else if(feature.get('name') == '暴雪红色预警'){
            src += '2.png';
        } else {
            src += '3.png';
        }

        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: src
            }))
        });
    }
    
    return {
        getSytle : getStyle,
        getStormStyle : getWarnSytle
    }
})

