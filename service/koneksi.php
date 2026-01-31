<?php 
    $host = "localhost";
    $usn = "root";
    $password = "";
    $db = "db_inventaris";

    $conn = ($host, $username, $password, $db);

if (!$conn) {
    die("koneksi gagal!" . mysqli_connect_error());
}