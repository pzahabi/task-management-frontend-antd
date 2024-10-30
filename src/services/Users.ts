import axios from "axios";
import { LoginCredentials, SignupCredentials } from "../constants/types";

const API_URL = 'http://localhost:5000/api';

export default class UserService {
    static async login(user: LoginCredentials) {
        return await axios.post(`${API_URL}/auth/signin`, user);
    }

    static async Signup(user: SignupCredentials) {
        return await axios.post(`${API_URL}/auth/signup`, user);
    }
}