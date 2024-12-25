import type { IBook } from "./book";

export interface IPromotion{
    id: number;
    title: string;
    slug: string;
    discount: number;
    description?: string;
    image: string;
    start_date: Date;
    end_date: Date;
    books?:IBook[];
}