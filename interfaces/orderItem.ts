import type { IBook } from "./book";

export interface IOrderItem{
    id: number;
    order_id: number;
    book_id: number;
    book?:IBook;
    quantity: number;
    price: number;
    discount: number;
    created_at?: Date;
    updated_at?: Date;
}
