<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/5/24
 * Time: 1:12
 */

require('dbConfig.php');

if($_POST['classCode']||$_POST['classCode']==0){

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    $mysqli->set_charset ("utf8" );
    $sql = sprintf("select * from coverdetailtable where classCode=%d",
            $_POST['classCode']);
    $result  =  $mysqli -> query ( $sql );
    $resultArr=array();
    while($row = $result -> fetch_array ( MYSQLI_ASSOC )){
            array_push($resultArr,$row);
    }
    $result -> free ();
    $mysqli->close();
}
echo  json_encode($resultArr);