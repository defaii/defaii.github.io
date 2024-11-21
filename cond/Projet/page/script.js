// Fonction pour basculer l'état du menu burger
document.addEventListener('DOMContentLoaded', function() {
  const menuBurger = document.querySelector('.menu-burger');
  
  // Vérifie si le menu burger existe avant d'ajouter l'écouteur
  if (menuBurger) {
      menuBurger.addEventListener('click', function() {
          const menuLinks = document.querySelector('.menu-links');
          
          // Bascule l'état du menu burger (affichage du menu et déplacement de l'icône)
          menuLinks.classList.toggle('active');
          menuBurger.classList.toggle('active');
      });
  }
});
// Dans l'onglet A, au moment du chargement de la page
window.addEventListener('load', () => {
  if (localStorage.getItem(`${this.document.title}`) === 'ouverte') {
    console.log(`La page ${this.document.title} est ouverte dans un autre onglet.`);
  }
  localStorage.setItem(`${this.document.title}`, 'ouverte'); // Définir la valeur indiquant que la page est ouverte
  console.log(
    "La page" ,this.document.title, "a été chargée",
  );
  
});

// Lorsque l'onglet est fermé, tu peux le signaler
window.addEventListener('beforeunload', () => {
  localStorage.removeItem(`${this.document.title}`); // Supprimer la valeur lorsque l'onglet est fermé
});


  function fermer(){
    console.log(localStorage)
    if (localStorage.getItem("Système Solaire")){
      console.log("j'ai la page systeme");
      console.log("Fermeture de la fenêtre");
      window.close();
    } else {
      console.log("J'ai pas la page");
      window.location.href = '../index.html';
    }
}