// api/openrouter.js
const CATEGORIES_VALIDES = [
  "Pédagogie", "Événement", 
  "Vie de campus", "Technologie", "Autre"
];

const CATEGORIE_DEFAUT = "Autre";

export async function suggererAvecIA(titre) {
  try {
    const response = await fetch("api/ai", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
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

