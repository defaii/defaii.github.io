// Fonction pour basculer l'état du menu burger
document.querySelector('.menu-burger').addEventListener('click', function() {
    const menuLinks = document.querySelector('.menu-links');
    const burger = document.querySelector('.menu-burger');
    
    // Bascule l'état du menu burger (affichage du menu et déplacement de l'icône)
    menuLinks.classList.toggle('active');
    burger.classList.toggle('active');
});
window.addEventListener("load", function () {
    console.log(
      "La page" ,this.document.title, "a été chargée",
    );
  });


  function fermer(){
    console.log("Fermeture de la fenêtre");
    window.close();
}

