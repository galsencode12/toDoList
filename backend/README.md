````markdown
# Documentation de l'API TodoList

---

### Note pour les développeurs frontend : Le token CSRF 🛡️

Pour des raisons de sécurité, certaines requêtes API nécessitent un **token CSRF (Cross-Site Request Forgery)**. Ce token est une protection contre les requêtes malveillantes.

Avant d'exécuter toute requête `POST`, `PUT` ou `DELETE`, vous devez impérativement suivre ces deux étapes :

1.  **Récupérer le token :** Faites une simple requête `GET` à l'endpoint `/api/csrf/`.
2.  **Utiliser le token :** Incluez le token reçu dans les headers de votre prochaine requête, sous le nom **`X-CSRFToken`**.

Voici un exemple simple pour une requête de connexion :

```javascript
// Étape 1 : Récupérer le token
f// Étape 1 : Récupérer le token
axios.get('/api/csrf/', { withCredentials: true })
  .then(response => {
    const csrfToken = response.data.csrfToken;

    // Étape 2 : Utiliser le token dans la requête POST
    const loginData = { email: 'user@example.com', password: 'password123' };

    axios.post('/api/login/', loginData, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken // token ajouté ici 
      },
      withCredentials: true
    })
    .then(result => {
      console.log(result.data);
    })
    .catch(error => {
      console.error("Erreur de connexion :", error.response.data);
    });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération du token CSRF :", error.response.data);
  });
````

-----

### Endpoints d'Authentification

#### 🔑 `/api/csrf/`

  * **Méthode :** `GET`
  * **Description :** Récupère le token CSRF nécessaire pour les requêtes de modification de données.
  * **Réponse :** `200 OK`
    ```json
    {
      "csrfToken": "token_CSRF_Généré"
    }
    ```

#### ✍️ `/api/register/`

  * **Méthode :** `POST`
  * **Authentification requise :** NON (token CSRF requis)
  * **Description :** Crée et connecte un nouvel utilisateur.
  * **Corps de la requête :**
      * `username` (string)
      * `email` (string)
      * `password` (string)
  * **Réponse :** `201 CREATED` si succès, `400 BAD REQUEST` si échec.

-----

#### 🚪 `/api/login/`

  * **Méthode :** `POST`
  * **Authentification requise :** NON (token CSRF requis)
  * **Description :** Connecte un utilisateur existant.
  * **Corps de la requête :**
      * `email` (string)
      * `password` (string)
  * **Réponse :** `200 OK` si succès, `401 UNAUTHORIZED` si échec.

-----

#### 🚶‍♀️ `/api/logout/`

  * **Méthode :** `POST`
  * **Authentification requise :** OUI (token CSRF requis)
  * **Description :** Déconnecte l'utilisateur.
  * **Réponse :** `200 OK`.

-----

### Endpoints de Gestion des Tâches

#### 📝 `/api/tasks/`

  * **Méthode :** `GET`, `POST`
  * **Authentification requise :** OUI
  * **Description :**
      * `GET` : Liste toutes les tâches de l'utilisateur.
      * `POST` : Crée une nouvelle tâche (token CSRF requis).
  * **Corps de la requête (`POST`) :**
      * `title` (string)
      * `description` (string, facultatif)
      * `due_date` (string, format YYYY-MM-DD, facultatif)
      * `priority` (integer: 0=faible, 1=moyenne, 2=élevée, par défaut 0)
  * **Réponse :** `200 OK` (`GET`), `201 CREATED` (`POST`).

-----

#### 🔍 `/api/tasks/filter/`

  * **Méthode :** `GET`
  * **Authentification requise :** OUI
  * **Description :** Filtre et recherche les tâches.
  * **Paramètres de la requête :**
      * `search` (string)
      * `state` (string: `active` ou `done`)
      * `priority` (string: `low`, `medium` ou `high`)
  * **Réponse :** `200 OK`

-----

#### 🖼️ `/api/tasks/<id>/`

  * **Méthode :** `GET`, `PUT`, `DELETE`
  * **Authentification requise :** OUI
  * **Description :** Gère une tâche spécifique par son ID.
  * **Paramètre d'URL :** `id` (integer)
  * **Corps de la requête (`PUT`) :**
      * `title` (string)
      * `description` (string)
      * `is_completed` (boolean)
      * `due_date` (string, format YYYY-MM-DD)
      * `priority` (integer)
  * **Réponse :** `200 OK` (`GET`, `PUT`), `204 NO CONTENT` (`DELETE`).

<!-- end list -->

```
```