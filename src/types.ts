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

export enum OrderStatus {
    RECEIVED = 'received',
    CONFIRMED = 'confirmed',
    PREPARED = 'prepared',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum PaymentMode {
    CARD = 'card',
    CASH = 'cash',
}

export type Accessory = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export interface CartItem extends Pick<Product, '_id' | 'name' | 'image' | 'priceConfiguration'> {
    chosenConfiguration: {
        priceConfiguration: {
            [key: string]: string;
        };
        selectedAccessorys: Accessory[];
    };
    qty: number;
}

export interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
}
export interface Order {
    _id: string;
    image: string;
    cart: CartItem[];
    customerId: Customer;
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    storeId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    createdAt: string;
}


export enum OrderEvents {
    ORDER_CREATE = 'ORDER_CREATE',
    PAYMENT_STATUS_UPDATE = 'PAYMENT_STATUS_UPDATE',
    ORDER_STATUS_UPDATE = 'ORDER_STATUS_UPDATE',
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export interface Coupon {
  id: string;
  title: string;
  code: string;
  validUpto: Date;
  storeId: number;
  discount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CouponCreatePayload = {
  title: string;
  code: string;
  validUpto: Date | string;
  discount: number;
  storeId?: number;
};
