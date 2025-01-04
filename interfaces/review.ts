import type { IBook } from "./book";
import type { IUser } from "./user";

export interface IReview {
    id: number;
    user_id: number;
    order_id: number;
    book_id: number;
    rating: number;
    book?:IBook;
    user?:IUser;
    comment: string;
    created_at: Date;
}