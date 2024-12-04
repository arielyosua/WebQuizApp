<?php
session_start();
$questions = [
    ['id' => 1, 
    'type' => 'multiple', 'question' => '5+5', 'options' => ['10', '1010', 'X', 'akar 100'], 'answer' => '10', 'score' => 20],
    ['id' => 2, 'type' => 'essay', 'question' => 'Siapa Pacar IDOY?', 'answer' => 'GEMA', 'score' => 20],
    ['id' => 3, 'type' => 'multiple', 'question' => 'Bahasa apa yang tidak dipakai pada pembuatan web ini?', 'options' => ['Javascipt', 'HTML', 'Python', 'CSS'], 'answer' => 'Python', 'score' => 20],
    ['id' => 4, 'type' => 'multiple', 'question' => 'Berapa jam kita kelas Praktikum Pemograman Web?', 'options' => ['1 JAM', '2 JAM', '3 JAM', '4 JAM'], 'answer' => '3 JAM', 'score' => 20],
    ['id' => 5, 'type' => 'essay', 'question' => 'Apa nama Praktikum ini?', 'answer' => 'Praktikum Pemograman Web', 'score' => 20]
];

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['username'], $_POST['usernim'])) {
    $_SESSION['username'] = htmlspecialchars($_POST['username']);
    $_SESSION['usernim'] = htmlspecialchars($_POST['usernim']);
    $_SESSION['score'] = 0;
    $_SESSION['current_question'] = 0;
}

if (isset($_POST['answer'])) {
    $currentIndex = $_SESSION['current_question'];
    $currentQuestion = $questions[$currentIndex];

    if ($currentQuestion['type'] === 'multiple' && $_POST['answer'] === $currentQuestion['answer']) {
        $_SESSION['score'] += $currentQuestion['score'];
    } elseif ($currentQuestion['type'] === 'essay' && strtolower(trim($_POST['answer'])) === strtolower($currentQuestion['answer'])) {
        $_SESSION['score'] += $currentQuestion['score'];
    }

    $_SESSION['current_question']++;
}

if ($_SESSION['current_question'] >= count($questions)) {
    $username = $_SESSION['username'];
    $usernim = $_SESSION['usernim'];
    $totalScore = $_SESSION['score'];

    $data = "Nama: $username\nNIM: $usernim\nTotal Score: $totalScore\n\n";
    file_put_contents('dataform.txt', $data, FILE_APPEND | LOCK_EX);

    session_destroy();

    echo "<h2>Hasil Kuis</h2>";
    echo "<p><strong>Nama:</strong> $username</p>";
    echo "<p><strong>NIM:</strong> $usernim</p>";
    echo "<p><strong>Total Score:</strong> $totalScore</p>";
    echo "<a href='quiz.php'>Mulai Kuis Lagi</a>";
    exit;
}

$currentQuestion = $questions[$_SESSION['current_question']];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kuis PHP</title>
</head>
<body>
    <h1>Kuis PHP</h1>
    <h2>Pertanyaan <?php echo $_SESSION['current_question'] + 1; ?></h2>
    <p><?php echo $currentQuestion['question']; ?></p>

    <form method="POST">
        <?php if ($currentQuestion['type'] === 'multiple'): ?>
            <?php foreach ($currentQuestion['options'] as $option): ?>
                <div>
                    <input type="radio" id="<?php echo $option; ?>" name="answer" value="<?php echo $option; ?>" required>
                    <label for="<?php echo $option; ?>"><?php echo $option; ?></label>
                </div>
            <?php endforeach; ?>
        <?php elseif ($currentQuestion['type'] === 'essay'): ?>
            <textarea name="answer" rows="5" required></textarea>
        <?php endif; ?>
        <button type="submit">Jawab</button>
    </form>
</body>
</html>
