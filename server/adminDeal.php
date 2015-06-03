<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/6/3
 * Time: 18:59
 */
require('dbConfig.php');

$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
$mysqli->set_charset ("utf8" );

if(isset($_POST['isOkId'])){
    echo var_dump($_POST['isOkId']);
    $changeIsOkSql=sprintf('update uploadimgtable set isOk=1 where id=%d',$_POST['isOkId']);
    $mysqli -> query($changeIsOkSql);
}


if(isset($_POST['getUpload'])){

    //返回json格式的数据交给gLayer处理
    $sql ="select * from uploadimgtable WHERE isOk=1";
    $result  =  $mysqli -> query ( $sql );
    $resultArr=array();
    while($row = $result -> fetch_array ( MYSQLI_ASSOC )){
        array_push($resultArr,$row);
    }
    echo json_encode($resultArr);

}

$mysqli->close();