// Fonction pour échapper les caractères spéciaux et éviter les injections XSS
export function sanitize(str) {
  const div = document.createElement("div");
  div.textContent = str;  
  return div.innerHTML; 
}

