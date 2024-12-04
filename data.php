<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <?php if($isError): ?>
    <p><?= $error ?></p> 
  <?php endif; ?>
  <?php if($_POST['username'] && $_POST['usernim']): ?>
    <h1><?= $_POST['username'] ?></h1>
    <h1><?= $_POST['usernim'] ?></h1>
  <?php endif ?>
  <form action="" method='post'>
    <div>
      <label for="nama">Nama: </label>
      <input id="nama" name="nama" />
    </div>
    <div>
      <label for="nim">Nim: </label>
      <input id="nim" nim="nim" />
    </div>
    <button type="submit">submit</button>
  </form>
</body>
</html>