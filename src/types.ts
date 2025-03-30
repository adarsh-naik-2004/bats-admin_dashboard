export type Credentials = {
    email: string;
    password: string;
};

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    store: Store | null;
};

export type Store = {
    id: number;
    name: string;
    address: string;
};

export type CreateUserData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    storeId: number;
};

export type FieldData = {
    name: string[];
    value?: string;
};

export type CreateStoreData = {
    name: string;
    address: string;
};

export interface StoreData extends CreateStoreData {
    id: string; 
}