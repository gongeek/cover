require(["esri/map", "esri/layers/WMSLayer", "esri/config", "dojo/domReady!"],
	function (Map, WMSLayer, EsriConfig) {

		//EsriConfig.defaults.io.corsEnabledServers.push("http://218.244.250.80:8080/erdas-apollo/coverage/CGLC");
		var map = new Map("map", {
			center: [-118, 34.5],
			zoom: 8,
			basemap: "topo"
		});
		debugger;
		var wmsLayer = new WMSLayer("http://218.244.250.80:8080/erdas-apollo/coverage/IMAGE2010", {
			format: "png"
		});
		debugger;
		map.addLayer(wmsLayer);
	});