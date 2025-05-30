import { CreateStoreData, CreateUserData, Credentials, OrderStatus } from "../types";
import { authApi, collectionApi, orderApi } from "./client";

// Auth Service APIs
export const login = (credentials: Credentials) => authApi.post('/auth/login', credentials);
export const self = () => authApi.get('/auth/self');
export const logout = () => authApi.post('/auth/logout', {});
export const getUsers = (queryString: string) => authApi.get(`/users?${queryString}`);
export const getStores = (queryString: string) => authApi.get(`/stores?${queryString}`);
export const createUser = (user: CreateUserData) => authApi.post('/users', user);
export const updateUser = (user: CreateUserData, id: string) => authApi.patch(`/users/${id}`, user);
export const createStore = (store: CreateStoreData) => authApi.post('/stores', store);
export const updateStore = (store: CreateStoreData, id: string) => authApi.patch(`/stores/${id}`, store);
export const deleteUser = (id: number) => authApi.delete(`/users/${id}`);

// Collection Service APIs
export const getCategories = () => collectionApi.get('/categories');
export const getProducts = (queryParam: string) => collectionApi.get(`/products?${queryParam}`);
export const createProduct = (product: FormData) => 
  collectionApi.post('/products', product, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id: string) => collectionApi.delete(`/products/${id}`);
export const getCategory = (id: string) => collectionApi.get(`/categories/${id}`);
export const updateProduct = (product: FormData, id: string) => 
  collectionApi.put(`/products/${id}`, product, { headers: { 'Content-Type': 'multipart/form-data' } });

// Order Service APIs
export const getOrders = (queryString: string) => orderApi.get(`/orders?${queryString}`);
export const getSingle = (orderId: string, queryString: string) => orderApi.get(`/orders/${orderId}?${queryString}`);
export const changeStatus = (orderId: string, data: { status: OrderStatus }) => orderApi.patch(`/orders/change-status/${orderId}`, data);