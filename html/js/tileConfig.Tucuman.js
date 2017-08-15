var	ConfigSource = {};

ConfigSource.data = {
	referenceSystems : {
		id: 'tucuman',
		epsg: 'EPSG:22183',
		projString: '+proj=tmerc +lat_0=-90 +lon_0=-66 +k=1 +x_0=3500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		resolutions: [
	960,480,240,120,60,30,15,7.5,3.75,1.875,0.9375
],
//Lower Left  ( 3482170.500, 6901043.500) ( 66d10'52.69"W, 28d 1'20.15"S)
//Upper Right ( 3651925.500, 7118693.500) ( 64d28'55.19"W, 26d 3' 0.46"S)

		origin:[3482170.500,6901043.500],
        bounds : {
        	bottom: {
        		x:3482170.500,
        		y:6901043.500 
	       	},
        	top: {
			x: 3651925.500,
        		y: 7118693.500 
        	}
        }
	},
	tms: [{
		desc: 'Tucuman',
		url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3ATucuman@tucuman@jpg/{z}/{x}/{y}.jpg',
		min: 0,
		max: 6
	},{
/*		desc: 'Spot Tucuman 1',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro1@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
*/
		desc: 'Mapa Base',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Atucuman@tucuman@png8/{z}/{x}/{y}.png8',
		min: 0,
			max: 9
	}],
	wms: [{
		url : 'http://geoservicios.indec.gov.ar/geoserver/ows?',
		service : 'geocenso2010:visor_CNA2018'
	}]
};


ConfigSource.loadMap = function ( ){
	if(typeof DataSource !== 'undefined'){
        if(DataSource.getConfig){
            ConfigSource.data = DataSource.getConfig();
        }
	}
    
    var crs = undefined;
	if(ConfigSource.data.referenceSystems ){
        var system = ConfigSource.data.referenceSystems;
        var array = [];
		for( x in system.resolutions){
            array.push(system.resolutions[x]);
        }

        crs = new L.Proj.CRS( system.epsg , system.projString, {
            resolutions: array,
            origin: system.origin,
            bounds: L.bounds(
                L.point(system.bounds.bottom.x,system.bounds.bottom.y),
                L.point(system.bounds.top.x,system.bounds.top.y)
            )
        });

        crs = crs
	}

    var mapDef = L.map('map', {
        center: [ -26.8263,-65.2291],            
        zoom: 3,
        minZoom: 0,
        maxZoom: 10,
        crs: crs
    });

    var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==");

    var base = {};

    var basemaps = {
        "Without background": white
    };

    var overlay = {};

    for( x in ConfigSource.data.tms ){
        overlay[ ConfigSource.data.tms[x].desc ] = L.tileLayer(ConfigSource.data.tms[x].url,{
            tms:true,
            noWrap: true,
            minNativeZoom: ConfigSource.data.tms[x].min,
            maxNativeZoom: ConfigSource.data.tms[x].max
        });
    }
//  16:00
    L.control.layers(basemaps, overlay, {collapsed: false}).addTo(mapDef);

    return mapDef;
};
