<?php
// Start the session
session_start();

// Check if the user is logged in and has a company ID
if (!isset($_SESSION['entreprise'])) {
    die("Vous devez être connecté pour voir cette page.");
}

$entreprise = $_SESSION['entreprise'];

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "haven";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch sales data for the logged-in user's company
$sql_sales = "SELECT articles, total_price, vendeur, date_vente FROM ventes WHERE entreprise = ?";
$stmt_sales = $conn->prepare($sql_sales);
$stmt_sales->bind_param("s", $entreprise);
$stmt_sales->execute();
$result_sales = $stmt_sales->get_result();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Ventes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 50px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .back-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.php" class="back-link">Retour à l'accueil</a>
        <h1>Liste des Ventes</h1>
        <table>
            <thead>
                <tr>
                    <th>Articles</th>
                    <th>Prix Total</th>
                    <th>Vendeur</th>
                    <th>Date de Vente</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result_sales->num_rows > 0) {
                    while($row = $result_sales->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . htmlspecialchars($row["articles"]) . "</td>";
                        echo "<td>" . htmlspecialchars($row["total_price"]) . "</td>";
                        echo "<td>" . htmlspecialchars($row["vendeur"]) . "</td>";
                        echo "<td>" . htmlspecialchars($row["date_vente"]) . "</td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='4'>Aucune vente trouvée</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php
// Close the database connection
$conn->close();
?>
