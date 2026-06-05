import { chargerIdees, ajouterIdee, 
         modifierIdee, supprimerIdee } from "./api/supabase.js";
import { suggererAvecIA } from "./api/openrouter.js";
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


function afficherTout(idees) {
  murIdees.innerHTML = "";
  idees.forEach((idee) => afficherIdee(idee));
}


// ==============================
// ÉVÉNEMENTS
// ==============================
form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const titre = sanitize(document.getElementById("Titre").value);
  const categorie = document.getElementById("Categorie").value;
  const description = sanitize(document.getElementById("Description").value);

  if (!validerFormulaire(titre, categorie, description)) return;

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

// Bouton IA
document.getElementById("btnSuggerer")
  .addEventListener("click", async function() {
  const titre = document.getElementById("Titre").value;
  if (titre.trim() === "") { alert("Écris un titre !"); return; }

  const btn = document.getElementById("btnSuggerer");
  btn.textContent = "⏳ L'IA génère...";
  btn.disabled = true;

  const suggestion = await suggererAvecIA(titre);
  document.getElementById("Categorie").value = suggestion.categorie;
  document.getElementById("Description").value = suggestion.description;

  btn.textContent = "✨ Suggérer avec l'IA";
  btn.disabled = false;
});


// Fonctions globales pour les boutons des cartes
window.editerIdee = async function(id) {
  const { data, error } = await supabaseClient
    .from("idees")
    .select("*")
    .eq("id", id)
    .single(); // récupère une seule idée avec l'id correspondant

  if (error) { console.error("Erreur édition :", error); return; }

  document.getElementById("Titre").value = data.titre;
  document.getElementById("Categorie").value = data.categorie;
  document.getElementById("Description").value = data.description;
  idEnEdition = id;
}
window.supprimerIdee = async function(id) { 
    const confirmation = confirm("Es-tu sûr de vouloir supprimer cette idée ?");
  if (!confirmation) return;

  const { error } = await supabaseClient
    .from("idees")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur suppression :", error);
    return;
  }

  await chargerIdees(); // recharge le mur
}

// ==============================
// INITIALISATION
// ==============================
chargerIdees().then(afficherTout);


