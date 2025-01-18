<?php
session_start(); // Start the session

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "haven";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Assume the company is stored in the session
$company = $_SESSION['entreprise'];

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['add'])) {
        $name = $_POST['name'];
        $price = $_POST['price'];
        $sql = "INSERT INTO articles (nom, prix, entreprise) VALUES ('$name', '$price', '$company')";
        $conn->query($sql);
    } elseif (isset($_POST['update'])) {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $price = $_POST['price'];
        $sql = "UPDATE articles SET nom='$name', prix='$price', entreprise='$company' WHERE id='$id'";
        $conn->query($sql);
    } elseif (isset($_POST['delete'])) {
        $id = $_POST['id'];
        $sql = "DELETE FROM articles WHERE id='$id'";
        $conn->query($sql);
    }
}

// Fetch articles for the specific company
$sql = "SELECT * FROM articles WHERE entreprise='$company'";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }
        header {
            background: #50b3a2;
            color: #fff;
            padding-top: 30px;
            min-height: 70px;
            border-bottom: #e8491d 3px solid;
        }
        header a {
            color: #fff;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 16px;
        }
        header ul {
            padding: 0;
            list-style: none;
        }
        header li {
            display: inline;
            padding: 0 20px 0 20px;
        }
        .main {
            padding: 20px;
            background: #fff;
            margin-top: 20px;
        }
        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        form {
            margin-top: 20px;
        }
        form input, form button {
            padding: 10px;
            margin: 5px;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Manage Articles</h1>
        </div>
    </header>
    <div class="container main">
        <form method="post">
            <input type="hidden" name="id" id="article_id">
            <label for="name">Name:</label>
            <input type="text" name="name" id="name" required>
            <label for="price">Price:</label>
            <input type="number" name="price" id="price" required>
            <label for="company">Company:</label>
            <input type="text" name="company" id="company" value="<?php echo $company; ?>" readonly>
            <button type="submit" name="add">Add Article</button>
            <button type="submit" name="update">Update Article</button>
        </form>
        <h2>Articles List</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Company</th>
                <th>Actions</th>
            </tr>
            <?php while($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?php echo $row['id']; ?></td>
                <td><?php echo $row['nom']; ?></td>
                <td><?php echo $row['prix']; ?></td>
                <td><?php echo $row['entreprise']; ?></td>
                <td>
                    <button onclick="editArticle(<?php echo $row['id']; ?>, '<?php echo $row['nom']; ?>', <?php echo $row['prix']; ?>, '<?php echo $row['entreprise']; ?>')">Edit</button>
                    <form method="post" style="display:inline;">
                        <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                        <button type="submit" name="delete">Delete</button>
                    </form>
                </td>
            </tr>
            <?php endwhile; ?>
        </table>
    </div>

    <script>
        function editArticle(id, name, price, company) {
            document.getElementById('article_id').value = id;
            document.getElementById('name').value = name;
            document.getElementById('price').value = price;
            document.getElementById('company').value = company;
        }
    </script>
</body>
</html>

<?php
$conn->close();
?>
