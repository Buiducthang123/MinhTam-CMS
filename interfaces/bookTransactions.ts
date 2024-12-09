import type { IBook } from "./book";

export interface IBookTransaction {
    id: number;
    book_id: number;
    user_id: number;
    type: number;
    status: number;
    quantity: number;
    price: number;
    note: string;
    date: Date;
    book?:IBook,
    created_at: Date;
    updated_at: Date;
}
