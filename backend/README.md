Documentation de l'API TodoList 

Note pour les développeurs frontend : Le jeton CSRF 🛡️
Pour des raisons de sécurité, certaines requêtes API nécessitent un jeton CSRF (Cross-Site Request Forgery). Ce jeton est une protection contre les requêtes malveillantes.

Avant d'exécuter toute requête POST, PUT ou DELETE, vous devez impérativement suivre ces deux étapes :

Récupérer le jeton : Faites une simple requête GET à l'endpoint /api/csrf/.

Utiliser le jeton : Incluez le jeton reçu dans l'en-tête de votre prochaine requête, sous le nom X-CSRFToken.

Voici un exemple simple pour une requête de connexion :

JavaScript

// Étape 1 : Récupérer le jeton
fetch('/api/csrf/')
  .then(response => response.json())
  .then(data => {
    const csrfToken = data.csrfToken;

    // Étape 2 : Utiliser le jeton dans la requête POST
    const loginData = { email: 'user@example.com', password: 'password123' };
    
    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken // Jeton ajouté ici 
      },
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
  });
Endpoints d'Authentification
🔑 /api/csrf/
Méthode : GET

Description : Récupère le jeton CSRF nécessaire pour les requêtes de modification de données.

Réponse : 200 OK

JSON

{
  "csrfToken": "Jeton_CSRF_Généré"
}
✍️ /api/register/
Méthode : POST

Authentification requise : NON (Jeton CSRF requis)

Description : Crée et connecte un nouvel utilisateur.

Corps de la requête :

username 

email 

password 

Réponse : 201 CREATED si succès, 400 BAD REQUEST si échec.

🚪 /api/login/
Méthode : POST

Authentification requise : NON (Jeton CSRF requis)

Description : Connecte un utilisateur existant.

Corps de la requête :

email 

password 

Réponse : 200 OK si succès, 401 UNAUTHORIZED si échec.

🚶‍♀️ /api/logout/
Méthode : POST

Authentification requise : OUI (Jeton CSRF requis)

Description : Déconnecte l'utilisateur.

Réponse : 200 OK.

Endpoints de Gestion des Tâches
📝 /api/tasks/
Méthode : GET, POST

Authentification requise : OUI

Description :

GET : Liste toutes les tâches de l'utilisateur.

POST : Crée une nouvelle tâche (Jeton CSRF requis).

Corps de la requête (POST) :

title 

description (string, facultatif)

due_date (string, format YYYY-MM-DD, facultatif)

priority (integer: 0=faible, 1=moyenne, 2=élevée, par défaut 0)

Réponse : 200 OK (GET), 201 CREATED (POST).

🔍 /api/tasks/filter/
Méthode : GET

Authentification requise : OUI

Description : Filtre et recherche les tâches.

Paramètres de la requête :

search 

state (string: active ou done)

priority (string: low, medium ou high)

Réponse : 200 OK

🖼️ /api/tasks/<id>/
Méthode : GET, PUT, DELETE

Authentification requise : OUI

Description : Gère une tâche spécifique par son ID.

Paramètre d'URL : id (integer)

Corps de la requête (PUT) :

title 

description 

is_completed (boolean)

due_date (string, format YYYY-MM-DD)

priority (integer)

Réponse : 200 OK (GET, PUT), 204 NO CONTENT (DELETE).