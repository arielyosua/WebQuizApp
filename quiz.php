<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fun Quiz</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="container">

        <p>Name: <?= htmlspecialchars($_POST['username']) ?></p>
        <br>
        <p>NIM: <?= htmlspecialchars($_POST['usernim']) ?></p>

        <!-- Quiz Page -->
        <div id="quiz-page" class="page active">
            <div class="quiz-header">
                <div id="timer-container">
                    <label class="switch">
                        <input type="checkbox" id="timer-toggle" checked>
                        <span class="slider"></span>
                    </label>
                    <span id="timer">30s</span>
                </div>
                <div id="progress">
                    Answered: <span id="answered">0</span> / <span id="total">7</span>
                </div>
            </div>
            <div id="question-container">
            </div>
            <div class="navigation">
                <button id="prev-btn" class="btn">Previous</button>
                <button id="next-btn" class="btn">Next</button>
            </div>
        </div>

        <!-- Results Page -->
        <div id="results-page" class="page">
            <h2>Hasil Quiz</h2>
            <div class="result-group">
                <p><strong>Nama:</strong> <span id="result-name"></span></p>
                <p><strong>NIM:</strong> <span id="result-nim"></span></p>
                <p><strong>Total Score:</strong> <span id="total-score"></span> / <span id="max-score"></span></p>
            </div>
            <button id="restart-btn" class="btn">Ulangi Quiz</button>
        </div>

    </div>

    <!-- Embed user data into JavaScript -->
    <script>
        const userData = {
            name: "<?= htmlspecialchars($_POST['username']) ?>",
            id: "<?= htmlspecialchars($_POST['usernim']) ?>"
        };
    </script>

    <script src="script.js"></script>
</body>

<footer>
    <p>&copy; 2024 Quiz App</p>
    <p>Ariel Yosua Hasibuan - 105222004 & Rayhan Surya Destian - 105222024</p>
</footer>
</html>
