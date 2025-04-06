import { CreateStoreData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = '/api/auth';
const CATALOG_SERVICE = '/api/catalog';

export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = ( queryString: string ) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getStores = ( queryString: string ) => api.get(`${AUTH_SERVICE}/stores?${queryString}`);
export const createUser = ( user: CreateUserData ) => api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = (user: CreateUserData, id: string) => api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const createStore = (store: CreateStoreData) => api.post(`${AUTH_SERVICE}/stores`, store);
export const updateStore = (store: CreateStoreData, id: string) => api.patch(`${AUTH_SERVICE}/stores/${id}`, store);
export const deleteUser = (id: number) => api.delete(`${AUTH_SERVICE}/users/${id}`);


export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryParam: string) => api.get(`${CATALOG_SERVICE}/products?${queryParam}`);
export const createProduct = (product: FormData) => api.post(`${CATALOG_SERVICE}/products`, product, { headers: { 'Content-Type': 'multipart/form-data' }, });
export const getCategory = (id: string) => api.get(`${CATALOG_SERVICE}/categories/${id}`);
export const updateProduct = (product: FormData, id: string) => {
    return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
