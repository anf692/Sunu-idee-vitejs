const CATEGORIES_VALIDES = [
  "Pédagogie", "Événement",
  "Vie de campus", "Technologie", "Autre"
];

// Fonction pour valider le formulaire et éviter les injections XSS
export function validerFormulaire(titre, categorie, description) {
  if (titre.trim().length < 3) {
    alert("Le titre doit contenir au moins 3 caractères !");
    return false;
  }
  if (description.trim().length < 10) {
    alert("La description doit contenir au moins 10 caractères !");
    return false;
  }
  if (!CATEGORIES_VALIDES.includes(categorie)) {
    alert("Catégorie invalide !");
    return false;
  }
  return true;
}

