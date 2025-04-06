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

export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    _id: string;
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export type ProductAttribute = {
    name: string;
    value: string | boolean;
};

export type Product = {
    _id: string;
    name: string;
    image: string;
    description: string;
    category: Category;
    priceConfiguration: PriceConfiguration;
    attributes: ProductAttribute[];
    isPublish: boolean;
    createdAt: string;
};

export type ImageField = { file: File };
export type CreateProductData = Product & { image: ImageField };
