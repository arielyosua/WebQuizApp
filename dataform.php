<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
   
    $username = htmlspecialchars($_POST['username']);
    $usernim = htmlspecialchars($_POST['usernim']);

  
    $data = "Nama: $username\nNIM: $usernim\n\n";

   
    $file = 'dataform.txt';
    file_put_contents($file, $data, FILE_APPEND | LOCK_EX);

 
    echo "<h2>Data Berhasil Disimpan</h2>";
    echo "<p><strong>Nama   :</strong> $username</p>";
    echo "<p><strong>NIM    :</strong> $usernim</p>";
    echo "<p>Terima kasih telah mengisi form.</p>";
} else {
    echo "<h2>Gagal Menyimpan Data</h2><p>Mohon isi form dengan benar.</p>";
}
?>