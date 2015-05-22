var map;
require([
	"esri/map",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ImageServiceParameters",
	"esri/layers/RasterFunction",
	"dojo/parser",
	"dojo/domReady!"
], function (Map,
             ArcGISImageServiceLayer,
             ImageServiceParameters,
             RasterFunction,
             parser) {
	parser.parse();

	map = new Map("map", {
		basemap: "topo",
		center: [104, 31],
		zoom: 6
	});


	var layerInfoMap = {
		'gengdi': [10, 249, 243, 193],
		'senlin': [20, 20, 119, 73],
		'caodi': [30, 169, 208, 95],
		'guanmudi': [40, 62, 179, 112],
		'shidi': [50, 126, 206, 244],
		'shuiti': [60, 0, 68, 154],
		'taiyuan': [70, 100, 100, 50],
		'renzaodibiao': [80, 147, 47, 20],
		'luodi': [90, 202, 202, 202],
		'bingxue': [100, 211, 237, 251]
	};


	var rasterFunction1 = new RasterFunction();
	rasterFunction1.functionName = "Colormap";
	rasterFunction1.functionArguments = {Colormap: [layerInfoMap['gengdi']]};
	var params1 = new ImageServiceParameters();
	params1.renderingRule = rasterFunction1;
	var gengdiLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params1
	});

	var rasterFunction2 = new RasterFunction();
	rasterFunction2.functionName = "Colormap";
	rasterFunction2.functionArguments = {Colormap: [layerInfoMap['senlin']]};
	var params2 = new ImageServiceParameters();
	params2.renderingRule = rasterFunction2;
	var senlinLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params2
	});


	var rasterFunction3 = new RasterFunction();
	rasterFunction3.functionName = "Colormap";
	rasterFunction3.functionArguments = {Colormap: [layerInfoMap['caodi']]};
	var params3 = new ImageServiceParameters();
	params3.renderingRule = rasterFunction3;
	var caodiLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params3
	});

	var rasterFunction4 = new RasterFunction();
	rasterFunction4.functionName = "Colormap";
	rasterFunction4.functionArguments = {Colormap: [layerInfoMap['guanmudi']]};
	var params4 = new ImageServiceParameters();
	params4.renderingRule = rasterFunction4;
	var guanmudiLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params4
	});


	var rasterFunction5 = new RasterFunction();
	rasterFunction5.functionName = "Colormap";
	rasterFunction5.functionArguments = {Colormap: [layerInfoMap['shidi']]};
	var params5 = new ImageServiceParameters();
	params5.renderingRule = rasterFunction5;
	var shidiLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params5
	});


	var rasterFunction6 = new RasterFunction();
	rasterFunction6.functionName = "Colormap";
	rasterFunction6.functionArguments = {Colormap: [layerInfoMap['shuiti']]};
	var params6 = new ImageServiceParameters();
	params6.renderingRule = rasterFunction6;
	var shuitiLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params6
	});


	var rasterFunction7 = new RasterFunction();
	rasterFunction7.functionName = "Colormap";
	rasterFunction7.functionArguments = {Colormap: [layerInfoMap['taiyuan']]};
	var params7 = new ImageServiceParameters();
	params7.renderingRule = rasterFunction7;
	var taiyuanLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params7
	});


	var rasterFunction8 = new RasterFunction();
	rasterFunction8.functionName = "Colormap";
	rasterFunction8.functionArguments = {Colormap: [layerInfoMap['renzaodibiao']]};
	var params8 = new ImageServiceParameters();
	params8.renderingRule = rasterFunction8;
	var renzaodibiaoLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params8
	});
	
	var rasterFunction9 = new RasterFunction();
	rasterFunction9.functionName = "Colormap";
	rasterFunction9.functionArguments = {Colormap: [layerInfoMap['luodi']]};
	var params9 = new ImageServiceParameters();
	params9.renderingRule = rasterFunction9;
	var luodiLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params9
	});
	
	var rasterFunction10 = new RasterFunction();
	rasterFunction10.functionName = "Colormap";
	rasterFunction10.functionArguments = {Colormap: [layerInfoMap['bingxue']]};
	var params10 = new ImageServiceParameters();
	params10.renderingRule = rasterFunction10;
	var bingxueLayer = new ArcGISImageServiceLayer
	("http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer", {
		imageServiceParameters: params10
	});


	map.addLayers([gengdiLayer, senlinLayer, renzaodibiaoLayer, taiyuanLayer,
		shuitiLayer, guanmudiLayer, shidiLayer, caodiLayer,luodiLayer,bingxueLayer]);
});