// Service d'authentification pour simuler les appels API
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api'; // URL du backend Django
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
  }

  // Simulation d'un délai réseau
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Inscription
  async register(userData) {
    await this.delay(1000); // Simulation délai réseau

    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = this.users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        password: userData.password, // En production, ne jamais stocker le mot de passe en clair
        createdAt: new Date().toISOString()
      };

      this.users.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(this.users));

      // Générer un token simulé
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }));

      return {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Connexion
  async login(credentials) {
    await this.delay(1000); // Simulation délai réseau

    try {
      // Chercher l'utilisateur
      const user = this.users.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Générer un token simulé
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
      }));

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Mot de passe oublié
  async forgotPassword(email) {
    await this.delay(1000); // Simulation délai réseau

    try {
      const user = this.users.find(u => u.email === email);
      if (!user) {
        throw new Error('Aucun compte trouvé avec cet email');
      }

      // En production, ici on enverrait un vrai email
      console.log(`Email de réinitialisation envoyé à ${email}`);
      
      return {
        message: 'Email de réinitialisation envoyé'
      };
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Vérifier la validité du token
  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    // Simulation de vérification
    await this.delay(500);
    
    // Vérifier si le token est au bon format
    return token.startsWith('mock_token_');
  }
}

export default new AuthService();