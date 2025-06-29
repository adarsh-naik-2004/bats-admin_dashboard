import { CreateStoreData, CreateUserData, Credentials, OrderStatus, Category } from "../types";
import { api } from "./client";
import { CouponCreatePayload } from "../types";

export const login = (credentials: Credentials) => api.post('/auth/login', credentials);
export const self = () => api.get('/auth/self');
export const logout = () => api.post('/auth/logout', {});
export const getUsers = (queryString: string) => api.get(`/users?${queryString}`);
export const getStores = (queryString: string) => api.get(`/stores?${queryString}`);
export const createUser = (user: CreateUserData) => api.post('/users', user);
export const updateUser = (user: CreateUserData, id: string) => api.patch(`/users/${id}`, user);
export const createStore = (store: CreateStoreData) => api.post('/stores', store);
export const updateStore = (store: CreateStoreData, id: string) => api.patch(`/stores/${id}`, store);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// Collection Service APIs
export const getCategories = () => api.get('/categories');
export const getProducts = (queryParam: string) => api.get(`/products?${queryParam}`);

export const createProduct = (product: FormData) => api.post('/products', product);

export const createCategory = (category: Category) => 
  api.post('/categories', category);

export const updateCategory = (category: Category, id: string) => 
  api.patch(`/categories/${id}`, category);

export const deleteCategory = (id: string) => 
  api.delete(`/categories/${id}`);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);
export const getCategory = (id: string) => api.get(`/categories/${id}`);

export const updateProduct = (product: FormData, id: string) => api.put(`/products/${id}`, product);

// Order Service APIs
export const getOrders = (queryString: string) => api.get(`/orders?${queryString}`);
export const getSingle = (orderId: string, queryString: string) => api.get(`/orders/${orderId}?${queryString}`);
export const changeStatus = (orderId: string, data: { status: OrderStatus }) => api.patch(`/orders/change-status/${orderId}`, data);

export const getCoupons = (queryString: string) => api.get(`/coupons?${queryString}`);
export const createCoupon = (coupon: CouponCreatePayload) => api.post('/coupons', coupon);
export const updateCoupon = (id: string, coupon: CouponCreatePayload) => api.put(`/coupons/${id}`, coupon);
export const deactivateCoupon = (id: string) => api.delete(`/coupons/${id}`);
export const reactivateCoupon = (id: string) => api.post(`/coupons/${id}/reactivate`, {});