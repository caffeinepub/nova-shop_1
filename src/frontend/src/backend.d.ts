import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    imageUrl?: string;
    category: Category;
    price: bigint;
}
export type UserId = Principal;
export type OrderId = bigint;
export type Category = string;
export type ProductId = bigint;
export interface Order {
    id: OrderId;
    userId: UserId;
    items: Array<[ProductId, bigint]>;
    totalPrice: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(userId: UserId): Promise<Array<Order>>;
    getProductById(productId: ProductId): Promise<Product | null>;
    getProductCount(): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsBySearch(searchText: string): Promise<Array<Product>>;
    getProductsBySearchAndCategory(searchText: string, category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(userId: UserId, items: Array<[ProductId, bigint]>, totalPrice: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
