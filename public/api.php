<?php


function getFiles($dir){
    $files = scandir($dir);
    $results = array();

    foreach($files as $key => $value){        
        $path = $dir.DIRECTORY_SEPARATOR.$value;
        if(!is_dir($path) && $value != '.DS_Store') {
            $results[] =  $value ;
        }
        else if(
            $value != "." 
            && $value != ".." 
            && $value != '.DS_Store' 
            && $value != '.@__thumb') {  
                $results[] =  [$value => getFiles($path)];
        }
    }
    return $results;
}

$files = getFiles('./music');

// CORS

 header('Access-Control-Allow-Origin: http://localhost:3000');
 header('Access-Control-Allow-Headers: origin, x-requested-with, content-type');
 header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');


header('Content-type: application/json');
echo json_encode( $files);

?>