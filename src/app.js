import { chargerIdees, ajouterIdee, 
         modifierIdee, supprimerIdee } from "./services/supabase.js";
import { suggererAvecIA } from "./services/openrouter.js";
import { validerFormulaire } from "./utils/validation.js";
import { sanitize } from "./utils/sanitize.js";

// ==============================
// ÉLÉMENTS DOM
// ==============================
const form = document.getElementById("Formulaire");
const murIdees = document.getElementById("MurIdees");
let idEnEdition = null;



// ==============================
// AFFICHAGE
// ==============================

// Fonction pour retourner la classe CSS de badge en fonction de la catégorie
function badgePourCategorie(categorie) {
    if (categorie === "Pédagogie")    return "badge-pedagogie";
    if (categorie === "Événement")    return "badge-evenement";
    if (categorie === "Vie de campus") return "badge-vie-de-campus";
    if (categorie === "Technologie")  return "badge-technologie";
    return "badge-autre";
}

// Fonction pour afficher une idée dans le mur des idées
function afficherIdee(idee) {
  const carte = document.createElement("div"); // crée une div
  carte.className = "col-12 col-sm-6 col-xl-4";
  carte.innerHTML = `
    <div class="idea-card">
        <span class="badge-categorie ${badgePourCategorie(idee.categorie)}">${idee.categorie}</span>
        <h3>${idee.titre}</h3>
        <p class="description">${idee.description}</p>
        <div class="card-actions">
        <button class="btn-editer" onclick="editerIdee(${idee.id})">Éditer</button>
        <button class="btn-supprimer" onclick="supprimerIdee(${idee.id})">Supprimer</button>
        </div>
    </div>
  `;
  murIdees.appendChild(carte); // ajoute la carte dans le mur
}

// Fonction pour afficher toutes les idées
function afficherTout(idees) {
  murIdees.innerHTML = "";
  idees.forEach((idee) => afficherIdee(idee));
}


// ==============================
// ÉVÉNEMENTS
// ==============================
form.addEventListener("submit", async function(event) {
  event.preventDefault();

  // Récupère et sanitize les valeurs du formulaire pour éviter les injections XSS
  const titre = sanitize(document.getElementById("Titre").value);
  const categorie = document.getElementById("Categorie").value;
  const description = sanitize(document.getElementById("Description").value);

  // Valide le formulaire avant de soumettrer
  if (!validerFormulaire(titre, categorie, description)) return;

  // Si on est en édition, on modifie l'idée, sinon on en ajoute une nouvelle
  try {
    if (idEnEdition !== null) {
      await modifierIdee(idEnEdition, titre, categorie, description);
      idEnEdition = null;
    } else {
      await ajouterIdee(titre, categorie, description);
    }
    const idees = await chargerIdees();
    afficherTout(idees);
    form.reset();
  } catch(e) {
    console.error("Erreur soumission :", e);
    alert("Une erreur est survenue !");
  }
});

// Bouton IA pour suggérer une catégorie et une description à partir du titre
document.getElementById("btnSuggerer")
  .addEventListener("click", async function() {
  const titre = document.getElementById("Titre").value;
  if (titre.trim() === "") { alert("Écris un titre !"); return; }

  // Affiche un état de chargement pendant que l'IA génère la suggestion
  const btn = document.getElementById("btnSuggerer");
  btn.textContent = "⏳ L'IA génère...";
  btn.disabled = true;

  // Appelle la fonction de suggestion IA et remplit les champs catégorie et description avec les résultats
  const suggestion = await suggererAvecIA(titre);
  document.getElementById("Categorie").value = suggestion.categorie;
  document.getElementById("Description").value = suggestion.description;

  btn.textContent = "✨ Suggérer avec l'IA";
  btn.disabled = false;
});


// Fonctions globales pour les boutons des cartes
window.editerIdee = async function(id) {
  try {
    const idees = await chargerIdees(); 
    const idee = idees.find(i => i.id === id);
    
    document.getElementById("Titre").value = idee.titre;
    document.getElementById("Categorie").value = idee.categorie;
    document.getElementById("Description").value = idee.description;
    idEnEdition = id;
  } catch(e) {
    console.error("Erreur édition :", e);
  }
}

// Fonction pour supprimer une idée avec confirmation
window.supprimerIdee = async function(id) {
  const confirmation = confirm("Es-tu sûr ?");
  if (!confirmation) return;
  
  try {
    await supprimerIdee(id);
    const idees = await chargerIdees();
    afficherTout(idees);
  } catch(e) {
    console.error("Erreur suppression :", e);
  }
}

// ==============================
// INITIALISATION
// ==============================
chargerIdees().then(afficherTout);


