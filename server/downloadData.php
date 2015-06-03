<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/6/2
 * Time: 14:53
 */
require('dbConfig.php');
session_start();
if(isset($_POST['yt'])&&isset($_SESSION['username'])){

    //TODO：根据session name 查询出邮箱
    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    $mysqli->set_charset ("utf8" );
    $emailSql=sprintf('select email from usertable where username="%s"',$_SESSION['username']);
    $emailResult=$mysqli->query($emailSql)->fetch_array();
    $email=$emailResult['email'];

    //TODO: insert into download table
    $insertSql='insert into downloadtable (username,email,zy,yt,ytms) VALUE (?,?,?,?,?)';
    $stmt  =  $mysqli -> prepare ($insertSql);
    $stmt->bind_param('sssss',$_SESSION['username'],$email,$_POST['zy'],$_POST['yt'],$_POST['ytms']);

    if($stmt -> execute ()){
        $stmt->close();
        echo '申请成功';
    }else{
        echo '申请失败';
    }
    $mysqli->close();
}else{
    echo '申请失败!';
}
