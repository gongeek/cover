<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/6/1
 * Time: 21:44
 */
require('dbConfig.php');
session_start();
if($_POST['repassword']!=$_POST['password']){
    echo '<h1>注册失败</h1><p>失败原因：2次密码输入不一样</p>';
}else{
    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    $mysqli->set_charset ("utf8" );
    $sql = sprintf("select * from usertable where username='%s'",
        $_POST['initusername']);
    $result  =  $mysqli -> query ( $sql );
    if(!$result->num_rows){
        $sql2="insert into usertable (username,email,password)VALUE (?,?,?)";
        $stmt  =  $mysqli -> prepare ( $sql2 );
        $stmt -> bind_param ( "sss" ,  $_POST['initusername'],$_POST['initemail'],$_POST['password'] );

        if($stmt -> execute ()){
            $stmt->close();
            echo '<h1>注册成功</h1>';
            //注册成功后保存到session
            $_SESSION['username']=$_POST['initusername'];
        }
    }else{
        $result -> free ();
        echo '<h1>注册失败</h1><p>失败原因：用户名已经被占用</p>';
    }
    $mysqli->close();
}
echo '<p><a href="/">返回首页</a></p>';