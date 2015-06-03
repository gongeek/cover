<?php
/**
 * Created by PhpStorm.
 * User: gongeek
 * Date: 2015/6/2
 * Time: 18:53
 */

require('dbConfig.php');
session_start();
//保存上传的图片


if(isset($_FILES["tp"])){
    if (!file_exists("uploadImg/" . $_FILES["tp"]["name"])) {
        move_uploaded_file($_FILES["tp"]["tmp_name"],
            "uploadImg/" . $_FILES["tp"]["name"]);
    }
}


//存数据库
if(isset($_POST['dd'])&&isset($_SESSION['username'])){
    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    $mysqli->set_charset ("utf8" );
    //TODO: insert into download table
    $insertSql='insert into uploadimgtable (username,dd,tp,tpms) VALUE (?,?,?,?)';
    $stmt  =  $mysqli -> prepare ($insertSql);
    $stmt->bind_param('ssss',$_SESSION['username'],$_POST['dd'],$_FILES["tp"]["name"],$_POST['tpms']);

    if($stmt -> execute ()){
        $stmt->close();
    }
    $mysqli->close();
}

function resizeImg($imgName,$maxWidth,$maxHeight,$saveName=''){//图片生成缩略图
    $arrImg = explode(".",$imgName);
    if($arrImg[1] == "jpg"){
        $im = imagecreatefromjpeg($imgName);
    }elseif($arrImg[1] == "png"){
        $im = imagecreatefrompng($imgName);
    }elseif($arrImg[1] == "gif"){
        $im = imagecreatefromgif($imgName);
    }
    $imgNewName = empty($saveName)?$imgName:$saveName;
    if($im){
        $width = imagesx($im);
        $height = imagesy($im);
        if(($maxWidth && $width>$maxWidth)||($maxHeight && $height>$maxHeight)){
            if($maxWidth && $width>$maxWidth){
                $widthRadio = $maxWidth/$width;
                $resizeWidth = true;
            }
            if($maxHeight && $height>$maxHeight){
                $heightRadio = $maxHeight/$height;
                $resizeHeight = true;
            }
            if($resizeHeight && $resizeWidth){
                if($widthRadio>$heightRadio){
                    $radio = $heightRadio;
                }else{
                    $radio = $widthRadio;
                }
            }elseif($resizeHeight){
                $radio = $heightRadio;
            }elseif($resizeWidth){
                $radio = $widthRadio;
            }

            $newwidth = $radio*$width;
            $newheight = $radio*$height;

            if(file_exists($imgNewName)) unlink($imgNewName);

            if(function_exists("imagecopyresampled")){

                imagesavealpha($im,true);

                $newim = imagecreatetruecolor($newwidth,$newheight);

                imagealphablending($newim,false);
                imagesavealpha($newim,true);
                imagecopyresampled($newim,$im,0,0,0,0,$newwidth,$newheight,$width,$height);

            }else{

                $newim = imagecreate($newwidth,$newheight);
                imagecopyresized($newim,$im,0,0,0,0,$newwidth,$newheight,$width,$height);
            }

            if($arrImg[1] == "jpg"){
                imagejpeg ($newim,$imgNewName);
            }elseif($arrImg[1] == "png"){
                imagepng($newim,$imgNewName);
            }elseif($arrImg[1] == "gif"){
                imagegif($newim,$imgNewName);
            }

            imagedestroy ($newim);
        }else{
            $arr = getimagesize($imgName);
            $this->imgEndWidth = $arr[0];
            $this->imgEndHeight = $arr[1];
            imagejpeg ($im,$imgNewName);
        }

    }



    return $imgNewName;
}


$imgPath = resizeImg("uploadImg/" . $_FILES["tp"]["name"],40,40,"smallImg/" . $_FILES["tp"]["name"]);



function borderImg($resourceImg,$savename="",$colorR=0,$colorG=0,$colorB=0){//给图片加边框
    $arrImg = explode(".",$resourceImg);
    if($arrImg[1] == "jpg"){
        $im = imagecreatefromjpeg($resourceImg);
    }elseif($arrImg[1] == "png"){
        $im = imagecreatefrompng($resourceImg);
        imagesavealpha($im,true);
    }elseif($arrImg[1] == "gif"){
        $im = imagecreatefromgif($resourceImg);
    }
    $imgWidth = imagesx($im);
    $imgHeight = imagesy($im);
    $tempPath = empty($savename)?$resourceImg:$savename;
    $colorImg = ImageColorAllocate($im,$colorR,$colorG,$colorB);
        ImageRectangle($im,0,0,$imgWidth-1,$imgHeight-1,$colorImg);

    if($arrImg[1] == "jpg"){
        imagejpeg($im,$tempPath,100);
    }elseif($arrImg[1] == "png"){
        imagepng($im,$tempPath);
    }elseif($arrImg[1] == "gif"){
        imagegif($im,$tempPath,100);
    }
    imagedestroy($im);
    return $tempPath;
}

borderImg($imgPath,"borderImg/" . $_FILES["tp"]["name"],255,255,255);




echo "http://localhost/server/uploadImg/" . $_FILES["tp"]["name"];