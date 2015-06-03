var map;
require([
	"esri/map",
    "esri/layers/GraphicsLayer",
	"esri/tasks/query",
	"esri/tasks/QueryTask",
	"esri/layers/OpenStreetMapLayer",
	"esri/InfoTemplate",
	"esri/layers/FeatureLayer",
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
	"esri/geometry/Point",
	"esri/symbols/Symbol",
	"esri/symbols/PictureMarkerSymbol",
	"esri/symbols/SimpleFillSymbol",
	"esri/graphic",
	"dojo/domReady!"
], function (Map,
             GraphicsLayer,
             Query,
             QueryTask,
             OpenStreetMapLayer,
             InfoTemplate,
             FeatureLayer,
             SpatialReference,
             Extent,
             ArcGISImageServiceLayer,
             ImageServiceParameters,
             RasterFunction,
             Measurement,
             Geocoder,
             dom,
             units,
             parser,
             Point,
             Symbol,
             PictureMarkerSymbol,
             SimpleFillSymbol,
             Graphic) {

	parser.parse();
	/*
	 * XMin: -264317.80638796743
	 YMin: 2836869.420345089
	 XMax: 884262.1936120326
	 YMax: 3861579.420345089
	 Spatial Reference: 32648  (32648) */

	//var extent = new Extent(
	//	{
	//		xmin: -264317.80638796743,
	//		ymin: 2836869.420345089,
	//		xmax: 884262.1936120326,
	//		ymax: 3861579.420345089,
	//		spatialReference: {wkid: 32648}
	//
	//	}
	//);

	map = new Map("map", {
		zoom: 6
		//extent: extent
	});




    map.centerAndZoom(new Point(104.06,30.67,new SpatialReference(4326))
        , 6);




//html5获取当前位置

	function mapLoadHandler(event) {
		if (navigator.geolocation) {
			// if you want to track as the user moves setup navigator.geolocation.watchPostion
			navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
		}
	}

	function locationError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				console.log("Location not provided");
				break;
			case error.POSITION_UNAVAILABLE:
				console.log("Current location not available");
				break;
			case error.TIMEOUT:
				console.log("Timeout");
				break;
			default:
				console.log("unknown error");
				break;
		}
	}

	function zoomToLocation(position) {
		var pointInit = new Point(position.coords.longitude, position.coords.latitude,
			new SpatialReference({wkid: 4326}));


		map.centerAndZoom(pointInit
			, 11);
		var symbol = new PictureMarkerSymbol("img/bluedot.png", 40, 40);
		map.graphics.clear();
		map.graphics.add(new Graphic(pointInit, symbol));
	}

	dojo.connect(map, "onLoad", mapLoadHandler);

	$('#current-btn').on('click', mapLoadHandler);

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
	('http://localhost:6080/arcgis/rest/services/scover/ImageServer', {
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


	var templateStr = '耕地:${ptable.a10}%</br>森林:${ptable.a20}%</br>' +
		'草地:${ptable.a30}%</br>灌木地:${ptable.a40}%</br>湿地:${ptable.a50}%</br>' +
		'水体:${ptable.a60}%</br>苔原:${ptable.a70}%</br>人造地表:${ptable.a80}%</br>' +
		'裸地:${ptable.a90}%</br>冰雪:${ptable.a100}%';
	var template = new InfoTemplate("${ptable.CITY_NAME}(地表覆盖占比情况)", templateStr);
	var featureLayer = new FeatureLayer('http://localhost:6080/arcgis/rest/services/xz/MapServer/2',
		{
			showLabels: true,
			id: 'xz',
			infoTemplate: template,
			outFields: ['*']
		});


	function findWells(evt) {
		var selectionQuery = new Query();
		var tol = map.extent.getWidth() / map.width * 5;
		var x = evt.mapPoint.x;
		var y = evt.mapPoint.y;
		selectionQuery.geometry = new Extent(x - tol, y - tol, x + tol, y + tol,
			evt.mapPoint.spatialReference);
		featureLayer.selectFeatures(selectionQuery, FeatureLayer.SELECTION_NEW);
	}

	featureLayer.on("click", findWells);
	featureLayer.on("selection-complete", function (evt) {

		//拿到要素数据
		var chartData = evt.features[0].attributes;
		var myPieChart = echarts.init(document.getElementById('pie-report'));

		var colorArr = ['#F9F3C1', '#147749', '#A9D05F',
			'#3EB370', '#7ECEF4', '#00449A',
			'#646432', '#932F14', '#CACACA',
			'#D3EDFB'];


		var pieOption = {
			color: colorArr,
			title: {
				text: chartData['ptable.CITY_NAME'],
				subtext: '地表覆盖',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {d}%"
			},
			legend: {
				orient: 'horizontal',
				y: 400,
				data: ['耕地', '森林', '草地', '灌木地', '湿地', '水体', '苔原', '人造地表', '裸地', '冰雪']
			},
			toolbox: {
				show: true,
				x: 'left',
				y: 60,
				feature: {
					mark: {show: true},
					dataView: {show: true, readOnly: false},
					magicType: {
						show: true,
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			calculable: true,
			//data:['耕地','森林','草地','灌木地','湿地','水体','苔原','人造地表','裸地','冰雪']
			series: [
				{
					name: '占比',
					type: 'pie',
					radius: '55%',
					center: ['50%', '45%'],
					data: [
						{
							value: chartData['ptable.a10'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a10'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a10'])
								}
							}
						}, name: '耕地'
						},
						{
							value: chartData['ptable.a20'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a20'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a20'])
								}
							}
						}, name: '森林'
						},
						{
							value: chartData['ptable.a30'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a30'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a30'])
								}
							}
						}, name: '草地'
						},
						{
							value: chartData['ptable.a40'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a40'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a40'])
								}
							}
						}, name: '灌木地'
						},
						{
							value: chartData['ptable.a50'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a50'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a50'])
								}
							}
						}, name: '湿地'
						},
						{
							value: chartData['ptable.a60'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a60'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a60'])
								}
							}
						}, name: '水体'
						},
						{
							value: chartData['ptable.a70'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a70'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a70'])
								}
							}
						}, name: '苔原'
						},
						{
							value: chartData['ptable.a80'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a80'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a80'])
								}
							}
						}, name: '人造地表'
						},
						{
							value: chartData['ptable.a90'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a90'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a90'])
								}
							}
						}, name: '裸地'
						},
						{
							value: chartData['ptable.a100'], itemStyle: {
							normal: {
								label: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a100'])
								},
								labelLine: {
									show: function (value) {
										if (value == 0) {
											return false;
										}
									}(chartData['ptable.a100'])
								}
							}
						}, name: '冰雪'
						}
					]
				}
			]
		};
        $("#report-warn").hide();
		myPieChart.setOption(pieOption);

		console.log(chartData);
	});


	$tabBtnLi.on('click', function (event) {
		$tabBtnLi.removeClass('active');
		$(event.currentTarget).addClass('active');
		$('#J_tab-content').find('.tab-content').removeClass('active').
			eq($(event.currentTarget).data('index')).addClass('active');

        //报表功能
		if ($(event.currentTarget).data('index') == 2) {
			map.addLayer(featureLayer);
		} else {
			map.removeLayer(featureLayer);
		}

        //上传功能
        if($(event.currentTarget).data('index')==4){
            $('#map_layers').css('cursor','crosshair');


            var fuckDojo=map.on('click',function(event){
                var mapPoint=event.mapPoint;
                var inputDD=mapPoint.getLongitude()+','+mapPoint.getLatitude();
                var ponit=new Point(mapPoint.getLongitude(),mapPoint.getLatitude(),new SpatialReference({wkid: 4326}));
                var symbol = new PictureMarkerSymbol("img/pointer.png", 40, 40);
                symbol.yoffset=20;
                map.graphics.clear();
                map.graphics.add(new Graphic(ponit, symbol));

                $('#dd').val(inputDD);
            });

        }else{
            $('#map_layers').css('cursor','default');

            //取消click事件
            fuckDojo.remove();
        }


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
			var firstCoor, i, insertStr, aList, $searchList;
			if (data.length > 0) {
				//缩放到第一选择中
				firstCoor = data[0].boundingbox;
				map.setExtent(new Extent(firstCoor[2], firstCoor[0], firstCoor[3],
					firstCoor[1], new SpatialReference({wkid: 4326})));

				var point = new Point((parseFloat(firstCoor[2]) +
					parseFloat(firstCoor[3])) / 2,
					(parseFloat(firstCoor[0]) + parseFloat(firstCoor[1])) /
					2, new SpatialReference({wkid: 4326}));


				var symbol = new PictureMarkerSymbol({
					"angle": 0,
					"xoffset": 0,
					"yoffset": 12,
					"type": "esriPMS",
					"url": "http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
					"imageData": "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",
					"contentType": "image/png",
					"width": 24,
					"height": 24
				});
				map.graphics.clear();
				map.graphics.add(new Graphic(point, symbol));


				$searchList = $('#search-list-group');
				$searchList.html('');

				for (i = 0; i < data.length; i++) {
					insertStr = '<a href="#" class="list-group-item" data-coor="' +
						data[i].boundingbox.join(',') + '"><p' +
						' class="list-group-item-text"  >' + data[i].display_name
						+ '</p></a>';
					$(insertStr).appendTo('#search-list-group');
				}
				aList = $searchList.find('a');
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


					var point = new Point((coorArr[2] + coorArr[3]) / 2,
						(coorArr[0] + coorArr[1]) / 2, new SpatialReference({wkid: 4326}));
					var symbol = new PictureMarkerSymbol({
						"angle": 0,
						"xoffset": 0,
						"yoffset": 12,
						"type": "esriPMS",
						"url": "http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
						"imageData": "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",
						"contentType": "image/png",
						"width": 24,
						"height": 24
					});

					map.graphics.clear();
					map.graphics.add(new Graphic(point, symbol));
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
	});
	var $tds = $('#detail-content').find('td');
	$tds.map(function (i, v) {
		v.index = i;
	});


	$tds.on('click', function (event) {
		$tds.removeClass('active');
		$(event.currentTarget).addClass('active');
		$('#cover-list').html('');
		$.post('http://localhost/server/getCoverByClassCode.php', {
			classCode: event.currentTarget.index
		}).done(function (data) {
			var i = 0, nodeSrc, $coverList, aList;
			data = $.parseJSON(data);
			for (i; i < data.length; i++) {
				nodeSrc = '<a href="#" class="list-group-item" data-coor="' +
					data[i].lonLat + '"><h4' + ' class="list-group-item-heading">'
					+ data[i].coverName + '</h4> <p' + ' class="list-group-item-text">'
					+ data[i].coverDetail + '</p></a>';
				$(nodeSrc).appendTo('#cover-list');
			}

			$coverList = $('#cover-list');
			aList = $coverList.find('a');
			aList.on('click', function (event) {

				var coorArr = $(event.currentTarget).data('coor').split(','),
					i;

				for (i = 0; i < coorArr.length; i++) {
					coorArr[i] = parseFloat(coorArr[i]);
				}

				aList.removeClass('active');
				$(event.currentTarget).addClass('active');


				var point = new Point(coorArr[0], coorArr[1],
					new SpatialReference({wkid: 4326}));
				map.centerAndZoom(point, 11);


				var symbol = new PictureMarkerSymbol("img/menu" + (($('#detail-content').
						find('.active'))[0].index + 1) + ".png", 40, 40);

				map.graphics.clear();
				map.graphics.add(new Graphic(point, symbol));
			})
		})
	});

	$($tds[0]).trigger('click');

	//快照

	$('#camera-btn').on('click', function () {
		coverLayer.exportMapImage(params, function (evt) {
			$('#download-btn').attr('href', evt.href);
			$('#download-btn')[0].click();
		});
	});

    //注册登入相关
    $('#loginout-btn').on('click',function(evt){
        $.post('/',{out:true}).then(function(data){
            location.href='/';
        });
    });
    //申请下载 ajax post

    $('#download-form-btn').on('click',function(event){

        event.preventDefault();
        $.post('/server/downloadData.php',{
            zy:$('#zy').val(),
            yt:$('#yt').val(),
            ytms:$('#ytms').val()
        }).done(function(data){
            if(data==='申请成功'){
                $('#download-form-btn').html('申请成功!').addClass('btn-success')
                    .attr('disabled','disabled');
            }else{
                $('#download-form-btn').html('申请失败!').addClass('btn-danger')
                    .attr('disabled','disabled');
            }
        })
    });


    //上传图片
    $('#upload-form-btn').on('click',function(event){
        event.preventDefault();
        var formData=new FormData($('#upload-form')[0]);
        var oReq = new XMLHttpRequest();

        oReq.open("POST", "/server/uploadImg.php",true);

        oReq.onload = function(oEvent) {
            if (oReq.status == 200) {
                $('#img-div').html('<img height=110 src="'+oReq.responseText+'">');

                $('#upload-form-btn').html('上传成功!继续上传').addClass('btn-success');

            } else {
                $('#upload-form-btn').html('上传失败!').addClass('btn-danger')
                    .attr('disabled','disabled');
            }
        };
        oReq.send(formData);
    });



    //新建GraphicsLayer
    var gLayer=new GraphicsLayer({
        infoTemplate:new InfoTemplate('图片详情','<p>图片:<img src="${imgUrl}"  width=100%></p><p>描述:${tpms}</p><p>所属:${tpUser}</p>')
    });

    $.post('/server/adminDeal.php',{getUpload:true}).done(function(data){

        var dataArr=$.parseJSON(data),
            i,
            point,
            symbol,
            graphic,
            ddArr=[];


        for(i=0;i<dataArr.length;i++){
            ddArr=dataArr[i]['dd'].split(',');
            point=new Point(ddArr[0],ddArr[1],new SpatialReference({wkid: 4326}));
            symbol = new PictureMarkerSymbol("/server/borderImg/"+dataArr[i]['tp'], 40, 40);
            symbol.yoffset=20;
            graphic=new Graphic(point, symbol,{imgUrl:("/server/uploadImg/"+dataArr[i]['tp']),tpms:dataArr[i]['tpms'],tpUser:dataArr[i]['username']});
            gLayer.add(graphic);
        }


        map.addLayer(gLayer);



    })




});