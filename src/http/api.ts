import { CreateStoreData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) => api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = ( queryString: string ) => api.get(`/users?${queryString}`);
export const getStores = ( queryString: string ) => api.get(`/stores?${queryString}`);
export const createUser = ( user: CreateUserData ) => api.post('/users', user);
export const updateUser = (user: CreateUserData, id: string) => api.patch(`/users/${id}`, user);
export const createStore = (store: CreateStoreData) => api.post(`/stores`, store);
export const updateStore = (store: CreateStoreData, id: string) => api.patch(`/stores/${id}`, store);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);