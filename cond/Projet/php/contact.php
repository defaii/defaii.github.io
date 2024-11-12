<?php
// Vérification que le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire
    $nom = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $sujet = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);
    
    // Traitement du message (par exemple, enregistrement dans une base de données ou envoi par email)
    // Ici, on simule l'envoi du message (à adapter selon vos besoins)
    // mail($email, $sujet, $message, "From: $nom <$email>");

    // Affichage d'un message de confirmation temporaire puis redirection vers main.html
    echo "<script>alert('Votre message a bien été envoyé !');</script>";
    echo "<script>window.location.href = 'main.html';</script>";
    exit;
} else {
    // Redirection vers le formulaire si l'utilisateur accède directement au script sans soumettre le formulaire
    header("Location: main.html");
    exit;
}
?>
