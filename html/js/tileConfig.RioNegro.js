var	ConfigSource = {};

ConfigSource.data = {
	referenceSystems : {
		id: 'rionegro',
		epsg: 'EPSG:22183',
		projString: '+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=3500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		resolutions: [
	3840,1920,960,480,240,120,60,30,15,7.5,3.75,1.875
],
		origin:[2977550.5,5333329.5],
        bounds : {
        	bottom: {
        		x: 2977550.5,
        		y: 5333329.5 
        	},
        	top: {
			x: 3783635.5,
        		y: 5841484.5
        	}
        }
	},
	tms: [{
		desc: 'Rio Negro',
		url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3ARioNegro@rionegro@jpg/{z}/{x}/{y}.jpg',
		min: 0,
		max: 8
	},{
		desc: 'Spot Rio Negro 1',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro1@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Spot Rio Negro 2',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro2@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Spot Rio Negro 3',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro3@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Spot Rio Negro 4',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro4@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Spot Rio Negro 5',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro5@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Spot Rio Negro 6',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro6@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Spot Rio Negro 7',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotRioNegro7@rionegro@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Mapa Base',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Arionegro@rionegro@png8/{z}/{x}/{y}.png8',
		min: 0,
			max: 11
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
        center: [ -39.0764197, -67.3710415],            
        zoom: 0,
        minZoom: 0,
        maxZoom: 12,
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
