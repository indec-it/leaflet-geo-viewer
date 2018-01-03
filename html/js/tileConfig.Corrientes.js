var	ConfigSource = {};

ConfigSource.data = {
	referenceSystems : {
		id: 'corrientes',
		epsg: 'EPSG:22186',
		projString: '+proj=tmerc +lat_0=-90 +lon_0=-57 +k=1 +x_0=6500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		resolutions: [
1583.1001757812483,
791.5500878906241,
395.77504394531206,
197.88752197265603,
98.94376098632802,
49.47188049316401,
24.735940246582004,
12.367970123291002,
6.183985061645501,
3.0919925308227505,
1.5459962654113752
],
		origin:[6231378.974,6597832.429],
        bounds : {
        	bottom: {
        		x: 6231378.974,
			y: 6597832.429
        	},
        	top: {
			x: 6636652.619,
        		y: 6985635.664
        	}
        }
	},
	tms: [{
		desc: 'Corrientes',
		url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3ACorrientes@corrientes@jpg/{z}/{x}/{y}.jpg',
		min: 0,
		max: 5
	},{
		desc: 'Spot Santo Tome',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotSantoTome@corrientes@png8/{z}/{x}/{y}.png8',
		min: 4,
		max: 9
	},{
		desc: 'Spot Santo Tome 2',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotSantoTome_2@corrientes@png8/{z}/{x}/{y}.png8',
		min: 4,
		max: 9
	},{
		desc: 'Spot Santo Tome 3',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotSantoTome_3@corrientes@png8/{z}/{x}/{y}.png8',
		min: 4,
		max: 9
	},{
		desc: 'Mapa Base',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Acorrientes@corrientes@png8/{z}/{x}/{y}.png8',
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
        center: [-28.54970,-56.03514], 
//-27.4688,-58.8312],            
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
