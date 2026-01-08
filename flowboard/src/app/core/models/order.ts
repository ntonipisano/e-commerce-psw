import { CartItem } from "./cartitems";

export interface Order {
    customer: unknown;
    address: unknown;
    items: CartItem[];
    total: number;
    createdAt: string;
}