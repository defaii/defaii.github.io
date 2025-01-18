<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Système de gestion des ventes</title>
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #e9ecef;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        header {
            background-color: #007bff;
            color: #fff;
            width: 100%;
            text-align: center;
        }
        main {
            width: 90%;
            max-width: 1200px;
            background-color: #fff;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h1, h2 {
            color: #333;
        }
        form {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
        button {
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #007bff;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
        .total-price {
            font-size: 1.2em;
            font-weight: bold;
        }
    </style>
    <script>
        function calculateTotal() {
            const quantities = document.querySelectorAll('input[name="quantity[]"]');
            const prices = document.querySelectorAll('input[name="article_price[]"]');
            let totalPrice = 0;

            quantities.forEach((quantity, index) => {
                const price = parseFloat(prices[index].value);
                const qty = parseInt(quantity.value);
                if (qty > 0) {
                    totalPrice += price * qty;
                }
            });

            document.getElementById('totalPrice').innerText = totalPrice.toFixed(2) + ' €';
        }

        document.addEventListener('DOMContentLoaded', () => {
            const quantityInputs = document.querySelectorAll('input[name="quantity[]"]');
            quantityInputs.forEach(input => {
                input.addEventListener('input', calculateTotal);
            });
        });
    </script>
</head>
<body>
    <header>
        <h1>Système de gestion des ventes</h1>
        <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
            <button onclick="window.location.href='manage.php'">gerer les article</button>
            <button onclick="window.location.href='creation_compte.php'">ajouter un compte</button>
            <button onclick="window.location.href='liste_vente.php'">Aller à une autre page</button>
        <?php endif; ?>
        <button onclick="window.location.href='logout.php'">Déconnexion</button>
    </header>
    <main>
        <?php
        // Database connection
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "haven";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: {$conn->connect_error}");
        }

        // Fetch articles from the database
        $sql = "SELECT id, nom, prix,entreprise FROM articles";
        $result = $conn->query($sql);

        $articles = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $articles[] = $row;
            }
        } else {
            echo "0 results";
        }
        $conn->close();
        ?>
        <form action="index.php" method="post">
            <table>
            <thead>
                <tr>
                <th>Nom de l'article</th>
                <th>Prix</th>
                <th>Quantité</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($articles as $article): ?>
                <?php if ($article['entreprise'] == $_SESSION['entreprise']): ?>
                <tr>
                    <td><?= htmlspecialchars(ucfirst($article['nom'])) ?></td>
                    <td><?= htmlspecialchars($article['prix']) ?> €</td>
                    <td>
                    <input type="hidden" name="article_price[]" value="<?= htmlspecialchars($article['prix']) ?>">
                    <input type="number" name="quantity[]" value="0" min="0" required>
                    </td>
                </tr>
                <?php endif; ?>
                <?php endforeach; ?>
            </tbody>
            </table>
            <p class="total-price"><strong>Prix total :</strong> <span id="totalPrice">0.00 €</span></p>
            <button type="submit">Valider la vente</button>
            <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $quantities = $_POST['quantity'];
            $articlePrices = $_POST['article_price'];

            // Reconnect to the database
            $conn = new mysqli($servername, $username, $password, $dbname);
            if ($conn->connect_error) {
                die("Connection failed: {$conn->connect_error}");
            }

            $articlesSold = [];
            $totalPrice = 0;
            foreach ($quantities as $index => $quantity) {
                if ($quantity > 0) {
                $articleName = $articles[$index]['nom'];
                $articlePrice = $articlePrices[$index];
                $totalPrice += $quantity * $articlePrice;
                $articlesSold[] = $quantity . ' x ' . $articleName;
                }
            }
            $articlesSoldString = implode(', ', $articlesSold);

            if ($totalPrice > 0) {
                // Insert sale into the database
                $stmt = $conn->prepare("INSERT INTO ventes (articles, total_price, vendeur, date_vente, entreprise) VALUES (?, ?,? , NOW(), ?)");
                $stmt->bind_param("sdss", $articlesSoldString, $totalPrice, $_SESSION['username'], $_SESSION['entreprise']);
                $stmt->execute();
                $stmt->close();

                // Store sale information in session
                $_SESSION['last_sale'] = [
                    'articles' => $articlesSoldString,
                    'total_price' => $totalPrice
                ];

                echo "<p>Vente enregistrée avec succès !</p>";
            } else {
                echo "<p>Erreur : Le prix total de la vente doit être supérieur à 0.</p>";
            }

            $conn->close();
            }

            // Display last sale information if available
            if (isset($_SESSION['last_sale'])) {
                echo "<p>Dernière vente : {$_SESSION['last_sale']['articles']} pour un total de {$_SESSION['last_sale']['total_price']} €</p>";
            }
            ?>
        </form>
    </main>
</body>
</html>
