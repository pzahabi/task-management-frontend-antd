import axios from "axios";
import { Task } from "../constants/types";
import Cookies from "js-cookie";
import { TaskPriority, TaskStatus } from "../constants/enums";

const API_URL = "http://localhost:5000/api";

export default class TaskService {
    static async getTasks(searchQuery: string | null, status: TaskStatus | null, priority: TaskPriority | null) {
        const response = await axios.get<Task[]>(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            params: {
                search: searchQuery,
                status,
                priority
            },
        });
        return response.data;
    }

    static async addTask(task: Task) {
        const response = await axios.post(`${API_URL}/tasks`, task, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        return response.data;
    }

    static async updateTaskStatus(id: string, status: string) {
        const response = await axios.patch(`${API_URL}/tasks/${id}/status`, { status }, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        return response.data;
    }

    static async updateTaskPriority(id: string, priority: string) {
        const response = await axios.patch(`${API_URL}/tasks/${id}/priority`, { priority }, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        return response.data;
    }

    static async deleteTask(id: string) {
        await axios.delete(`${API_URL}/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
    }
}
