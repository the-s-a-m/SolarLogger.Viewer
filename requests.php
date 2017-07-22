<?php 
require_once "dbLogic/DBAccess.php";

$dbConnection = new DBAccess();

//insert measurement into DB
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    //get json content and insert into db
    $allHeaders = getallheaders();
    $contentType = $allHeaders['Content-Type'];
    if($contentType !== 'application/json') {
        exit(0);
    }

    $postContent = file_get_contents('php://input');
    $data = json_decode($postContent,true);
    if(strlen($postContent) < 30 || json_last_error() !== JSON_ERROR_NONE) {
        exit(0);
    }

    $dataCreated = "";
    $dataSolarinstallationcode = "";
    foreach ($data as $key => $value) {
        if($key == "requesttime") {
            $dataCreated = htmlspecialchars($value);
        } else if($key == "solarinstallationcode") {
            $dataSolarinstallationcode = htmlspecialchars($value);
        }
    }
    if(strlen($dataCreated) > 0 && strlen($dataSolarinstallationcode) > 10) {
        $dbConnection->insertMeasurement($dataCreated, $dataSolarinstallationcode, $postContent);
    }
    exit(0);
} else if($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['timerange'])) {
    //Get requests with statistics data
    header('Content-Type: application/json');
    $timerange = htmlspecialchars($_GET['timerange']);
    $rows = array();
    if("day" == $timerange) {
        $rows = $dbConnection->getCurrentDay();
    } else if("month" == $timerange) {
        $rows = $dbConnection->getLast30DaysMax();
    } else if("year" == $timerange) {
        $rows = $dbConnection->getMonthMax();
    }
    $response = "[";
    for ($i = 0; $i < count($rows); $i++) {
        $row = $rows[$i];
        $response .= str_replace('&quot;', '"', $row['data']);
        if($i < count($rows) - 1) {
            $response .= ", ";
        }
    }
    $response .= " ]";
    echo $response;
    
    exit(0);
}








?>
