var map;
require([
	"esri/map",
	"esri/layers/OpenStreetMapLayer",
	"esri/SpatialReference",
	"esri/geometry/Extent",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ImageServiceParameters",
	"esri/layers/RasterFunction",
	"esri/dijit/Measurement",
	"esri/dijit/Geocoder",
	"dojo/dom",
	"esri/units",
	"dojo/parser",
	"dojo/domReady!"
], function (Map,
             OpenStreetMapLayer,
             SpatialReference,
             Extent,
             ArcGISImageServiceLayer,
             ImageServiceParameters,
             RasterFunction,
             Measurement,
             Geocoder,
             dom,
             units,
             parser) {
	parser.parse();

	map = new Map("map", {
		center: [104, 31],
		zoom: 6
	});


	var osmLayer = new OpenStreetMapLayer();
	map.addLayer(osmLayer);

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


	var rasterFunction = new RasterFunction();

	rasterFunction.functionName = 'Colormap';
	rasterFunction.functionArguments = {
		Colormap: [layerInfoMap['gengdi'],
			layerInfoMap['senlin'], layerInfoMap['caodi'], layerInfoMap['guanmudi'],
			layerInfoMap['shidi'], layerInfoMap['shuiti'],
			layerInfoMap['taiyuan'], layerInfoMap['renzaodibiao'],
			layerInfoMap['luodi'], layerInfoMap['bingxue']]
	};

	var params = new ImageServiceParameters();
	params.noData = 0;
	//TODO:params.width not work

	params.renderingRule = rasterFunction;

	var coverLayer = new ArcGISImageServiceLayer
	('http://localhost:6080/arcgis/rest/services/Sichuan_Land30_1/ImageServer', {
		imageServiceParameters: params,
		opacity: 0.5
	});

	map.addLayer(coverLayer);


	var initColorArr = rasterFunction.functionArguments.Colormap;

	//input btn
	var $input = $('#J_layerInfo').find('input');


	$('#J_SwitchBtn').on('click', function (event) {
		var $J_layerInfo = $('#J_layerInfo');
		if ($J_layerInfo.css('display') === 'none') {
			$J_layerInfo.slideDown(200);
		} else {
			$J_layerInfo.slideUp(200);
		}
	});

	$('#J_select_all').on('change', function (event) {
		if ($(this).prop('checked')) {
			$input.prop('checked', true);
		} else {
			$input.prop('checked', false);
		}
	});

	var tempColorMap;
	var i;
	$input.on('change', function (event) {
		tempColorMap = [];
		for (i = 1; i < $input.length; i++) {
			if ($input.eq(i).prop('checked')) {
				tempColorMap.push(initColorArr[i - 1]);
			}
		}

		if (tempColorMap.length === 0) {
			coverLayer.hide();
		} else {
			coverLayer.show();
		}
		rasterFunction.functionArguments.Colormap = tempColorMap;
		coverLayer.setRenderingRule(rasterFunction, false);

	});


	$('#J_show_tuli').on('click', function (event) {
		var $tuLi = $('#J_tuli');
		if ($tuLi.css('display') === 'none') {
			$tuLi.css('display', 'block');
			$tuLi.animate({
				width: 176,
				paddingLeft: 5,
				paddingRight: 5
			}, 200);
		} else {
			$tuLi.animate({
				width: 0,
				paddingLeft: 0,
				paddingRight: 0
			}, 200).promise().done(function () {
				$tuLi.css('display', 'none');
			});
		}
	});

	var measurement = new Measurement({
		map: map,
		defaultAreaUnit: units.SQUARE_KILOMETERS,
		defaultLengthUnit: units.KILOMETERS
	}, dom.byId("measurementDiv"));

	measurement.startup();


	$('#J_measure_btn').on('click', function (event) {
		var $measure = $('#J_measure_tool');
		if ($measure.css('display') === 'none') {
			$measure.slideDown(200);
		} else {
			$measure.slideUp(200);
		}
	});

	var $tabDiv = $('#J_tab-btn');
	var $tabBtnLi = $tabDiv.find('li');

	$tabBtnLi.on('mouseenter', function (event) {
		$('#over-blue').animate({
			top: $(event.target).data('index') * 60
		}, 80, 'linear')
	});


	$tabBtnLi.on('click', function (event) {
		$tabBtnLi.removeClass('active');
		$(event.currentTarget).addClass('active');

		debugger;

		$('#J_tab-content').find('.tab-content').removeClass('active').
			eq($(event.currentTarget).data('index')).addClass('active');

	});

	$tabDiv.find('ul').on('mouseleave', function (event) {
		$('#over-blue').animate({
			top: $tabDiv.find('.active').data('index') * 60
		}, 80, 'linear')
	});


	function dealSearch(event) {
		var url = 'http://nominatim.openstreetmap.org/search.php?q='
			+ $('#search-place').val() + '&format=json';
		$.get(url).done(function (data) {
			var firstCoor, i, insertStr, aList;
			if (data.length > 0) {
				//缩放到第一选择中
				firstCoor = data[0].boundingbox;
				map.setExtent(new Extent(firstCoor[2], firstCoor[0], firstCoor[3],
					firstCoor[1], new SpatialReference({wkid: 4326})));




				$('#search-list-group').html('');

				for (i = 0; i < data.length; i++) {
					insertStr = '<a href="#" class="list-group-item" data-coor="' +
						data[i].boundingbox.join(',') + '"><p' +
						' class="list-group-item-text"  >' + data[i].display_name
						+ '</p></a>';
					$(insertStr).appendTo('#search-list-group');
				}
				aList = $('.list-group').find('a');
				aList.eq(0).addClass('active');

				aList.on('click', function (event) {
					var coorArr = $(event.currentTarget).data('coor').split(','),
						i;

					for (i = 0; i < coorArr.length; i++) {
						coorArr[i] = parseFloat(coorArr[i]);
					}

					aList.removeClass('active');
					$(event.currentTarget).addClass('active');
					map.setExtent(new Extent(coorArr[2], coorArr[0], coorArr[3],
						coorArr[1], new SpatialReference({wkid: 4326})));

				})

			} else {
				$('#search-list-group').html('暂无结果');
			}
		})
	}

	$('#search-btn').on('click', dealSearch);
	$('#search-place').on('keydown', function (event) {
		if (event.keyCode === 13) {
			dealSearch(event);
		}
	})

});