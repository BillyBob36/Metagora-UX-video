// Helper pour obtenir le chemin correct des assets en fonction de l'environnement
// En production, ajoute le BASE_URL, en dev retourne le chemin tel quel
export function getAssetUrl(path: string): string {
  // En développement, retourner le chemin tel quel
  if (import.meta.env.DEV) {
    return path;
  }
  // En production, ajouter le BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

