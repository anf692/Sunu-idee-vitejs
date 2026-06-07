const CATEGORIES_VALIDES = [
  "Pédagogie", "Événement", 
  "Vie de campus", "Technologie", "Autre"
];

const CATEGORIE_DEFAUT = "Autre";

// Fonction pour échapper les caractères spéciaux et éviter les injections XSS
export async function suggererAvecIA(titre) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it:freeze-2024-06-01",
        messages: [{
          role: "user",
          content: `Tu es un assistant pour Sunu-Idées.
Titre : "${titre}"
Réponds UNIQUEMENT en JSON valide :
{
  "categorie": "une valeur parmi : ${CATEGORIES_VALIDES.join(", ")}",
  "description": "2 phrases maximum en français"
}`
        }]
      })
    });

    // Traite la réponse de l'IA
    const data = await response.json();
    const raw = data.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    const suggestion = JSON.parse(clean);

    // Vérifie que la catégorie retournée est valide
    if (!CATEGORIES_VALIDES.includes(suggestion.categorie)) {
      suggestion.categorie = CATEGORIE_DEFAUT;
    }

    return suggestion;

  } catch(e) {
    console.warn("Fallback IA activé :", e);
    return {
      categorie: CATEGORIE_DEFAUT,
      description: "Description à compléter."
    };
  }
}

