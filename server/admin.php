

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>管理员账户</title>
    <link rel="stylesheet"
          href="../bower_components/bootstrap/dist/css/bootstrap.min.css"/>
</head>
<body>


<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/6/3
 * Time: 15:31
 */
require('dbConfig.php');
$lStr=<<<'EOT'
<h1 style="margin:30px auto;width: 30%">请先登入!</h1>
<div id="login" class="row" style=" margin:auto;width: 30%" >
    <form class="form-horizontal" method="post" action="/server/admin.php">
        <div class="form-group">
            <label for="mname" class="col-sm-2 control-label">管理员账户</label>
            <div class="col-sm-10">
                <input type="text" name="mname" class="form-control" id="mname" placeholder="请输入管理员账号">
            </div>
        </div>
        <div class="form-group">
            <label for="mpassword" class="col-sm-2 control-label">密码</label>
            <div class="col-sm-10">
                <input type="password" name="mpassword" class="form-control" id="mpassword" placeholder="请输入密码">
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">登入</button>
            </div>
        </div>
    </form>
</div>
EOT;



//修改isok


if(!(isset($_POST['mname'])&&isset($_POST['mpassword'])&&
    $_POST['mname']=='gongwei'&&$_POST['mpassword']=='qwerty' )  ){
    echo $lStr;
    exit();
}



$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
$mysqli->set_charset ("utf8" );
$sql ="select * from uploadimgtable WHERE isOk=0";
$result  =  $mysqli -> query ( $sql );
$resultArr=array();
while($row = $result -> fetch_array ( MYSQLI_ASSOC )){
    array_push($resultArr,$row);
}



$sql2="select * from downloadtable WHERE isDown=0";
$result2=$mysqli->query($sql2);

$result2Arr=array();

while($row2=$result2->fetch_array(MYSQLI_ASSOC)){
    array_push($result2Arr,$row2);
}


$result -> free ();
$mysqli->close();

?>

<div style="width: 80%;margin: 20px auto">

<h3>待审核的上传图片</h3>
<table id="imgTable" class="table table-bordered table-hover" >
    <thead>
    <tr>
        <th>ID</th>
        <th>用户名</th>
        <th>经纬度</th>
        <th>图片</th>
        <th>图片描述</th>
        <th>审核状态</th>
    </tr>
    </thead>
    <tbody>

<?php

for($i=0;$i<count($resultArr);$i++){
    echo "<tr>
<td>{$resultArr[$i]['id']}</td>
<td>{$resultArr[$i]['username']}</td>
<td>{$resultArr[$i]['dd']}</td>
<td><img src='/server/uploadImg/{$resultArr[$i]['tp']}' width=150></td>
<td>{$resultArr[$i]['tpms']}</td>
<td><button data-id='{$resultArr[$i]['id']}' class='btn btn-primary'>还未审核</button></td>
</tr>";
}

?>


    </tbody>
</table>

    <h3>待审核的下载申请</h3>
    <table id="dTable" class="table table-bordered table-hover">
        <thead>
        <tr>
            <th>Id</th>
            <th>用户名</th>
            <th>用户邮箱</th>
            <th>用户职业</th>
            <th>下载用途</th>
            <th>用途描述</th>
            <th>审核状态</th>
        </tr>
        </thead>
        <tbody>


        <?php

        for($j=0;$j<count($result2Arr);$j++){
            echo "<tr>
<td>{$result2Arr[$j]['id']}</td>
<td>{$result2Arr[$j]['username']}</td>
<td>{$result2Arr[$j]['email']}</td>
<td>{$result2Arr[$j]['zy']}</td>
<td>{$result2Arr[$j]['yt']}</td>
<td>{$result2Arr[$j]['ytms']}</td>
<td><button data-id='{$result2Arr[$j]['id']}' data-email='{$result2Arr[$j]['email']}' class='btn btn-primary'>还未审核</button></td>
</tr>";

        }

        ?>



        </tbody>
    </table>
</div>


<script src="../bower_components/jquery/dist/jquery.min.js"></script>
<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script>
    $(document).ready(function(){
        $('#imgTable').find('button').click(function(event){
            var $cur=$(this);
            $.post('/server/adminDeal.php',{isOkId:$(this).data('id')}).
                done(function(data){
                    $cur.html('审核通过');
                    $cur.addClass('btn-success').
                        attr('disabled','disabled')
                });
        });

        $('#dTable').find('button').on('click',function(event){
            var $cur=$(this);
            $.post('/server/adminDeal.php',{isDownId:$(this).data('id'),email:$(this).data('email')}).
                done(function(data){
                    $cur.html('审核通过');
                    $cur.addClass('btn-success').
                        attr('disabled','disabled')
                });


        })

    })
</script>
</body>
</html>