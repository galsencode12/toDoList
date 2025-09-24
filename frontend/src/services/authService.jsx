import { BASE_URL, getCSRFToken } from "../helpers";

// Service d'authentification
class AuthService {
  constructor() {
    this.baseURL = BASE_URL; // URL du backend
  }
  // Inscription
  async register(userData) {
    //Appel l'endpoint /register
    const token = await getCSRFToken();
    const response = await fetch(`${this.baseURL}/register/`, {
      method: "POST",
      // credentials :include permet d'include le session_id dans les cookies ,
      // Important pour l'authentification coté backend
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        //ajout du token csrf dans les headers
        "X-CSRFToken": token,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log(response.status);
    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    return data;
  }

  // Connexion
  async login(credentials) {
    //Appel l'endpoint /login
    const token = await getCSRFToken();
    const response = await fetch(
      `${this.baseURL}/login/`,

      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": token,
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();
    console.log(response.status);
    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la connexion");
    }
    return data;
  }
  // je commente ca parce que c'est pas une fonctionalité que j'ai implémenté dans le backend
  // Mot de passe oublié
  // async forgotPassword(email) {
  // const token = await getCSRFToken();
  //   const response = await fetch(`${this.baseURL}/forgot-password`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  // "X-CSRFToken": token,
  //     },
  //     body: JSON.stringify({ email }),
  //   });

  //   const data = await response.json();

  //   if (!response.ok) {
  //     throw new Error(data.message || "Erreur lors de l'envoi de l'email");
  //   }

  //   return data;
  // }

  // Déconnexion
  async logout() {
    //Appel l'endpoint /logout
    const token = await getCSRFToken();
    const response = await fetch(`${this.baseURL}/logout/`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    });
    console.log(response.status);
    console.log(response.json());
  }

  // Vérifier si l'utilisateur est connecté
  async isAuthenticated() {
    const token = await getCSRFToken();
    //Appel l'endpoint /is_authenticated
    const response = await fetch(`${this.baseURL}/is_authenticated/`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    });
    //{authenticated:boolean}
    const authenticated = await response.json();
    console.log(authenticated);
    return authenticated.authenticated;
  }
}

export default new AuthService();
