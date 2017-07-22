<?php
require_once "dbLogic/DBConfig.php";

class DBAccess {
    private $servername = "127.0.0.1";
    private $username = "";
    private $password = "";
    private $database = "";

    function __construct() {
        $dbconfig = new DBConfig();
        $this->servername = $dbconfig->servername;
        $this->username = $dbconfig->username;
        $this->password = $dbconfig->password;
        $this->database = $dbconfig->database;
    }

    private function getConnection() {
        try {
            $conn = new PDO("mysql:host=$this->servername;dbname=$this->database", $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
            // set the PDO error mode to exception for testing
            //$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            return $conn;
        } catch (PDOException $e) {
            // Do nothing db connection error (do not display or respond)
            //echo "DataBase Error: " . $e->getMessage();
        }
        return null;
    }

    function insertMeasurement($dataCreated, $dataSolarinstallationcode, $jsonData) {
        $respSolarinstallationNr = "";
        $respSolarinstallationName = "";
        
        $conn = $this->getConnection();
        if($conn == null) { return; }
        $stmt = $conn->prepare("SELECT idx, name from `solarinstallationcodes` where `solarinstallationcode` like :installationcode;");
        $stmt->bindValue(':installationcode', $dataSolarinstallationcode);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($result as $row){
            $respSolarinstallationNr = $row['idx'];
            $respSolarinstallationName = $row['name'];
        }
        $jsonData = str_replace($dataSolarinstallationcode, $respSolarinstallationName, $jsonData);
        $jsonData = str_replace('solarinstallationcode', 'solarinstallationname', $jsonData);
        
        $stmt = $conn->prepare('INSERT INTO `loggerdata` (`idx`, `idx_installationcode`, `created`, `data`) 
                    Values(NULL, :installationNr, :created, :data );');
        
        $stmt->bindValue(':installationNr', htmlspecialchars($respSolarinstallationNr));
        $stmt->bindValue(':created', htmlspecialchars($dataCreated));
        $stmt->bindValue(':data', htmlspecialchars($jsonData));
        if(strlen($respSolarinstallationNr) > 0 && strlen($respSolarinstallationName) > 0) {
            $stmt->execute();
        }
        $conn = null;
    }

    function getCurrentData() {
        $conn = $this->getConnection();
        if($conn == null) { return; }
        $stmt = $conn->prepare("SELECT idx, created, data FROM loggerdata ORDER BY idx DESC LIMIT 1");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        return $result[0];
    } 

    function getCurrentDay() {
        $conn = $this->getConnection();
        if($conn == null) { return; }
        $stmt = $conn->prepare("SELECT data FROM loggerdata WHERE created >= CONCAT(CURDATE(), ' 00:00:00') ORDER BY idx");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        return $result;
    }

    function getLast30DaysMax() {
        $conn = $this->getConnection();
        if($conn == null) { return; }
        $stmt = $conn->prepare("SELECT 
                        t1.external_id, loggerdata.created, loggerdata.data
                        FROM 
                        (
                            SELECT MAX(idx) AS external_id
                            FROM loggerdata
                            GROUP BY DATE_FORMAT(created, '%Y-%m-%d')
                        ) as t1
                        INNER JOIN loggerdata ON t1.external_id = loggerdata.idx
                        WHERE created >= now() - interval 30 day");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        return $result;
    }

    function getMonthMax() {
        $conn = $this->getConnection();
        if($conn == null) { return; }
        $stmt = $conn->prepare("SELECT 
                t1.external_id, loggerdata.created, loggerdata.data
                FROM 
                (
                    SELECT MAX(idx) AS external_id
                    FROM loggerdata
                    GROUP BY DATE_FORMAT(created, '%Y-%m-01')
                ) as t1
                INNER JOIN loggerdata ON t1.external_id = loggerdata.idx");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        return $result;
    }

    function getLastYearsMax() {
        $conn = $this->getConnection();
        if($conn == null) { return; }
        $stmt = $conn->prepare("SELECT 
                t1.external_id, loggerdata.created, loggerdata.data
                FROM 
                (
                    SELECT MAX(idx) AS external_id
                    FROM loggerdata
                    GROUP BY DATE_FORMAT(created, '%Y-12-01')
                ) as t1
                INNER JOIN loggerdata ON t1.external_id = loggerdata.idx");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        return $result;
    }

}



?>