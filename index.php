
<?php
require('/server/dbConfig.php');
session_start();

//ajax 请求
if(isset($_POST['out'])){
    unset($_SESSION['username']);
    echo 'session clear !';
    exit();
}

?>

<!DOCTYPE html>
<html>
<head lang="zh-CN">
	<meta charset="UTF-8">
	<title></title>
	<link rel="stylesheet"
	      href="./bower_components/bootstrap/dist/css/bootstrap.min.css"/>
	<!--<link rel="stylesheet"-->
	<!--href="http://js.arcgis.com/3.13/dijit/themes/claro/claro.css">-->
	<!--<link rel="stylesheet" href="http://js.arcgis.com/3.13/esri/css/esri.css">-->
	<link rel="stylesheet" href="./css/claro.css"/>
	<link rel="stylesheet" href="./css/esri.css"/>
	<link rel="stylesheet" href="./css/style.css"/>
</head>
<body class="container-fluid">
<div class="row header">
	<h1><a href="/"><img src="./img/logo.png" alt="四川省地表覆盖系统" width="50"/>
		在线四川地表覆盖知识地图集
	</a></h1>
    <div class="user-info">

        <?php


            if(isset($_POST['username'])){
                //登入验证
                $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
                $mysqli->set_charset ("utf8" );
                $sql = sprintf("select * from usertable where username='%s' and password='%s'",
                    $_POST['username'],$_POST['password']);
                $result  =  $mysqli -> query ( $sql );

                if($result->num_rows){
                    $_SESSION['username']=$_POST['username'];
                    $result->free();
                    $mysqli->close();
                }

            }

            if(isset($_SESSION['username'])){
                echo '<a href="javascript:;"><span class="glyphicon glyphicon-user"></span><span>你好,'.$_SESSION['username'].'</span></a><a href="javascript:;" id="loginout-btn" ><span class="glyphicon glyphicon-log-out"></span>退出</a>';
            }else{
                echo '<a href="javascript:;" class="login-btn" data-toggle="modal" data-target="#loginModal"><span class="glyphicon glyphicon-user"></span>登入</a><a href="javascript:;" class="register-btn" data-toggle="modal" data-target="#registerModal"><span class="glyphicon glyphicon-flash"></span>注册</a>';
            }

        echo '<a href="#"><span class="glyphicon glyphicon-question-sign"></span>帮助</a>';

        ?>



    </div>
</div>
<div class="row main">
	<div class="left">
		<div id="J_tab-btn">
			<div id="over-blue"></div>
			<ul>
				<li data-index="0" class="active">
					<a href="javascript:;">
						<span class="glyphicon glyphicon-search"></span><br/>
						搜索
					</a>
				</li>
				<li data-index="1">
					<a href="javascript:;">
						<span class="glyphicon glyphicon-th-large"></span><br/>
						详情</a>
				</li>
				<li data-index="2">
					<a href="javascript:;">
						<span class="glyphicon glyphicon-equalizer"></span><br/>
						报表</a>
				</li>
                <li data-index="3">
					<a href="javascript:;">
						<span class="glyphicon glyphicon-download"></span><br/>
						下载</a>
				</li>
                <li data-index="4">
					<a href="javascript:;">
						<span class="glyphicon glyphicon-upload"></span><br/>
						上传</a>
				</li>

			</ul>
		</div>
		<div id="J_tab-content">
			<div id="search-content" class="tab-content active">
				<div class="input-group">
					<input type="text" class="form-control" id="search-place"
					       placeholder="请输入搜索地址"
					       aria-describedby="search-btn">
					<span class="input-group-addon" id="search-btn">搜索</span>
				</div>

				<div class="scroll-y-plane">
					<div class="list-group" id="search-list-group">
					</div>
				</div>
			</div>
			<div id="detail-content" class="tab-content">
				<table class="table table-bordered">
					<tbody>
					<tr>
						<td class="active">
							<img src="./img/menu1.png" alt="水体" width='30'/><br/>水体
						</td>
						<td><img src="./img/menu2.png" alt="湿地" width='30'/><br/>湿地</td>
						<td><img src="./img/menu3.png" alt="人造" width='30'/><br/>人造</td>
						<td><img src="./img/menu4.png" alt="苔原" width='30'/><br/>苔原</td>
						<td><img src="./img/menu5.png" alt="冰川" width='30'/><br/>冰川</td>
					</tr>
					<tr>
						<td><img src="./img/menu6.png" alt="草地" width='30'/><br/>草地</td>
						<td><img src="./img/menu7.png" alt="裸地" width='30'/><br/>裸地</td>
						<td><img src="./img/menu8.png" alt="耕地" width='30'/><br/>耕地</td>
						<td><img src="./img/menu9.png" alt="灌木" width='30'/><br/>灌木</td>
						<td><img src="./img/menu10.png" alt="森林" width='30'/><br/>森林</td>
					</tr>
					</tbody>
				</table>


				<div class="scroll-y-plane">

					<div class="list-group" id="cover-list">
					</div>
				</div>
			</div>
			<div id="report-content" class="tab-content">
                <h4 style="padding: 8px;border-radius:4px " id="report-warn" class="bg-warning">请先单击右图的行政区域</h4>
				<div id="pie-report" style="height: 100%"></div>
				<div id="bar-report" style="height: 100%"></div>

			</div>
            <div id="download-content" class="tab-content">
                <?php
                $s1=<<<'EOT'
<h4 style="padding: 8px;border-radius:4px " class="bg-warning">检测到您没有登入，登入后方可下载!</h4>
EOT;
                $s2=<<<'EOT'
<h4 style="padding: 8px;border-radius:4px " class="bg-primary">请填写下面的申请表单</h4>
                <blockquote style="font-size: 14px">
                    <p>可供下载的数据为四川省地表覆盖分类栅格数据,
                        审核通过后会将下载链接发送到您的邮箱中</p>
                </blockquote>
                <form id='download-form'>
                    <div class="form-group">
                        <label for="zy">您的职业</label>
                        <input required="required" class="form-control" type="text" name="zy" id="zy" placeholder="请输入您的职业"/>
                    </div>
                    <div class="form-group">
                        <label for="yt">下载用途</label>
                        <select id="yt" name="yt" class="form-control">
                            <option>请选择</option>
                            <option>实验研究</option>
                            <option>测试</option>
                            <option>学习</option>
                            <option>其它</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="ytms">用途描述</label>
                        <textarea required="required" name="ytms" id="ytms"  placeholder="请详细描述您的用途(100字以内)" class="form-control" rows="6"></textarea>
                    </div>
                    <button id="download-form-btn" class="btn btn-default btn-primary">提交下载申请</button>
                </form>
EOT;
                if(isset($_SESSION['username'])){
                    echo $s2;
                }else{
                    echo $s1;
                }

                ?>

            </div>

            <div id="upload-content" class="tab-content">

                <?php

                $upStr=<<<'EOT'
<h4 style="padding: 8px;border-radius:4px " class="bg-primary">请完成上传表单</h4>
                <blockquote style="font-size: 14px">
                    <p>您可上传地表照片数据，待审核后，会将您上传的图片，分享并展示到地图上</p>
                </blockquote>
                <form action="/server/uploadImg.php" method="post" id="upload-form"
                      enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="dd">拍摄地点(经纬度:lon,lat)</label>
                        <input required="required" class="form-control" type="text" name="dd" id="dd" placeholder="请输入经纬度,也可以单击地图获取"/>
                    </div>
                    <div class="form-group">
                        <label for="tp">上传图片(建议尺寸500X500)</label>
                        <input required="required" type="file" id="tp" name="tp">
                        <div id="img-div" style="margin: 8px 0 0 0 "></div>
                    </div>
                    <div class="form-group">
                        <label for="tpms">图片描述</label>
                        <textarea required="required" name="tpms" id="tpms"  placeholder="请描述您上传的图片(50字以内)" class="form-control" rows="3"></textarea>
                    </div>
                    <button id="upload-form-btn" class="btn btn-default btn-primary">上传图片</button>
                </form>
EOT;
                $infoStr=<<<'EOT'
<h4 style="padding: 8px;border-radius:4px " class="bg-warning">检测到您没有登入，登入后方可上传!</h4>
EOT;
                if(isset($_SESSION['username'])){
                    echo $upStr;
                }else{
                    echo $infoStr;
                }
                ?>



            </div>

		</div>
	</div>
	<div class="right">
		<div id="map">
			<div id="J_SwitchBtn" class="map-btn">
				<span class="glyphicon glyphicon-th-list"></span>
				图层
			</div>
			<div id="J_layerInfo" class="map-plane">
				<p>
					<label><input id="J_select_all" checked type="checkbox"/>全部选中</label>
				</p>
				<label><input type="checkbox" checked/>耕地</label></p>
				<label><input type="checkbox" checked/>森林</label></p>
				<label><input type="checkbox" checked/>草地</label></p>
				<label><input type="checkbox" checked/>灌木地</label></p>
				<label><input type="checkbox" checked/>湿地</label></p>
				<label><input type="checkbox" checked/>水体</label></p>
				<label><input type="checkbox" checked/>苔原</label></p>
				<label><input type="checkbox" checked/>人造地表</label></p>
				<label><input type="checkbox" checked/>裸地</label></p>
				<label><input type="checkbox" checked/>冰雪</label></p>
			</div>

			<div id="J_show_tuli" class="map-btn">
				<span class="glyphicon glyphicon-exclamation-sign"></span><br/>
				图<br/>例
			</div>
			<div id="J_tuli" class="map-plane">
				<table>
					<tr>
						<td>
							<div class="tuli-color color-1"></div>
						</td>
						<td>耕地</td>
						<td>
							<div class="tuli-color color-2"></div>
						</td>
						<td>森林</td>
					</tr>
					<tr>
						<td>
							<div class="tuli-color color-3"></div>
						</td>
						<td>草地</td>
						<td>
							<div class="tuli-color color-4"></div>
						</td>
						<td>灌木地</td>
					</tr>
					<tr>
						<td>
							<div class="tuli-color color-5"></div>
						</td>
						<td>湿地</td>
						<td>
							<div class="tuli-color color-6"></div>
						</td>
						<td>水体</td>
					</tr>
					<tr>
						<td>
							<div class="tuli-color color-7"></div>
						</td>
						<td>苔原</td>
						<td>
							<div class="tuli-color color-8"></div>
						</td>
						<td>人造地表</td>
					</tr>
					<tr>
						<td>
							<div class="tuli-color color-9"></div>
						</td>
						<td>裸地</td>
						<td>
							<div class="tuli-color color-10"></div>
						</td>
						<td>冰雪</td>
					</tr>
				</table>
			</div>

			<div id="J_measure_btn" class="map-btn">
				<span class="glyphicon glyphicon-text-width"></span>
				测量
			</div>
			<div id="J_measure_tool" class="map-plane">
				<div id="titlePane" data-dojo-type="dijit/TitlePane"
				     data-dojo-props="title:'Measurement', closable:'false', open:'false'">
					<div id="measurementDiv"></div>
				</div>
			</div>

			<div id="current-btn" class="map-btn">
				<span class="glyphicon glyphicon-cd"></span>定位
			</div>
			<div id="camera-btn" class="map-btn">
				<span class="glyphicon glyphicon-camera"></span>快照
			</div>
			<a id='download-btn' href="#" download></a>
		</div>
	</div>
</div>




<!--弹出框-->
<!--登入 Modal -->
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">登入</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" method="post" action="/">
                    <div class="form-group">
                        <label for="username" class="col-sm-4 control-label">用户名:</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" name="username" id="username" placeholder="请输入用户名">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="col-sm-4 control-label">密码:</label>
                        <div class="col-sm-8">
                            <input type="password" name="password" class="form-control" id="password" placeholder="请输入密码">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-4 col-sm-8">
                            <button type="submit" class="btn btn-default btn-primary">登入</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">注册</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" method="post" action="/server/register.php">
                    <div class="form-group">
                        <label for="username" class="col-sm-4 control-label">用户名:</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" name="initusername" id="initusername" placeholder="请输入用户名">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="initemail" class="col-sm-4 control-label">邮箱:</label>
                        <div class="col-sm-8">
                            <input type="email" class="form-control" name="initemail" id="initemail" placeholder="请输入邮箱">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="col-sm-4 control-label">密码:</label>
                        <div class="col-sm-8">
                            <input type="password" class="form-control" name="password" id="password" placeholder="请输入密码">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="repassword" class="col-sm-4 control-label">确认密码:</label>
                        <div class="col-sm-8">
                            <input type="password" class="form-control" name="repassword" id="repassword" placeholder="请再次输入密码">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-4 col-sm-8">
                            <button type="submit" class="btn btn-default btn-primary">注册</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="./arcgis_js_api/library/3.9/3.9/init.js"></script>
<!--<script src="http://js.arcgis.com/3.13/"></script>-->
<!--<script src="./js/echarts/echarts.js"></script>-->
<script src="./js/echarts/echarts-all.js"></script>
<script src="./js/mapInit.js"></script>
<!--<script src="js/example.js"></script>-->

</body>
</html>