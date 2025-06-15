import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth/";

class UsuarioService {

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
        });
    }

    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ROLE_ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('role')
        return role === 'ROLE_USER'
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }

    async login(user) {
        try {
            const response = await this.client.post(`/login`, user);
            console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async register(userData, token) {
        try {
            const response = await this.client.post(`/register`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async getAllUsers(token) {
        try {
            const response = await this.client.get(`/admin/get-all-users`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async getYourProfile(token) {
        try {
            const response = await this.client.get(`/adminuser/get-profile`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async getUserById(userId, token) {
        try {
            const response = await this.client.get(`/admin/get-users/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId, token) {
        try {
            const response = await this.client.delete(`/admin/delete/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async updateUser(userId, userData, token) {
        try {
            const response = await this.client.put(`/admin/update/${userId}`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

}

export default UsuarioService;