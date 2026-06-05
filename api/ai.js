// function handler pour l'endpoint /api/ai qui relaie les requêtes vers l'API d'OpenRouter
export default async function handler(req, res) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)// Transmet la requête du client à l'API d'OpenRouter
    });

    const data = await response.json();

    res.status(200).json(data);// Renvoie la réponse de l'IA au client

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });// En cas d'erreur, renvoie un message d'erreur au client
  }
}

