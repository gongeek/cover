<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/5/24
 * Time: 1:12
 */
if($_POST['coverName']){

    $db_host='localhost';
    $db_user='gongeek';
    $db_password='123456';
    $db_name='cover';

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    $mysqli->set_charset ("utf8" );

    $sql = "INSERT INTO
    `coverdetailtable` (classCode, coverName,lonLat, coverDetail)
    VALUES (?,?,?,?)";



    $stmt = $mysqli->prepare($sql);

    $stmt->bind_param('isss', $_POST['classCode'], $_POST['coverName'],
        $_POST['lonLat'],$_POST['coverDetail']);
    $stmt->execute();
    $stmt->close();
    $mysqli->close();
}
echo  $_POST['coverName'];