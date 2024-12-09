import type { IBook } from "./book";

export interface ICategory {
    id: number;
    name: string;
    avatar?: string;
    description: string;
    slug: string;
    quantity_book: number;
    parent_id: number;
    parent?: ICategory;
    children?:ICategory[];
    books?:IBook[];
}
