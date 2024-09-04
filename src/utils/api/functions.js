// Export specific API calls using the generic function
import {userStore} from "@/utils/zustand.js";
import api from "./api.js";
import {apiRequest} from "@/utils/api/reactQuery.jsx";

const token = "userStore.use?.token"

export const login = async (loginData) => apiRequest({ url: api.testApi, method: 'GET',data:loginData });

export const fetchTodos = async () => apiRequest({ url: '/todos', method: 'GET', token });

export const fetchTodoById = async (id ) => apiRequest({ url: `/todos/${id}`, method: 'GET', token });

export const createTodo = async (newTodo ) => apiRequest({ url: '/todos', method: 'POST', data: newTodo, token });

export const updateTodo = async (id, updatedTodo) => apiRequest({ url: `/todos/${id}`, method: 'PUT', data: updatedTodo, token });

export const deleteTodo = async (id) => apiRequest({ url: `/todos/${id}`, method: 'DELETE', token });
