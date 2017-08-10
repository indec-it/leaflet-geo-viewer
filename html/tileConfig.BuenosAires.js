var	ConfigSource = {};

ConfigSource.data = {
	referenceSystems : {
		id: 'san_pedro',
		epsg: 'EPSG:22185',
		projString: '+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		resolutions: [
			       3864.47012139567,
				1932.235060697835,
				966.1175303489175,
				483.05876517445876,
				241.52938258722938,
				120.76469129361469,
				60.382345646807345,
				30.191172823403672,
				15.095586411701836,
				7.547793205850918,
				3.773896602925459,
				1.8869483014627295,
				0.9434741507313648
],
	origin:[5183669.384186787,5451985.903941361],
        bounds : {
        	bottom: {
        		x: 5183669.384186787,
        		y: 5451985.903941361 
        	},
        	top: {
			x: 5810709.852556057,
        		y: 6320419.894620156
        	}
        }
	},
	tms: [{
		desc: 'Buenos Aires',
		url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3ABuenosAires@buenosaires@png8/{z}/{x}/{y}.png8',
		min: 0,
		max: 7
	},{
		desc: 'San Pedro 2',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Aspot_san_pedro2@buenosaires@png8/{z}/{x}/{y}.png8',
		min: 0,
		max: 9
	},{
		desc: 'San Pedro',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Aspot_san_pedro1@buenosaires@png8/{z}/{x}/{y}.png8',
		min: 0,
		max: 9
	},{
		desc: 'Mapa Base',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Abuenosaires@buenosaires@png8/{z}/{x}/{y}.png8',
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
        center: [ -33.77,-59.70],            
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
