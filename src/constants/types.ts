import { TaskPriority, TaskStatus } from "./enums";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus
    priority: TaskPriority
    duedate: Date;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials {
    username: string;
    password: string;
    email: string;
    name: string;
    surname: string;
}