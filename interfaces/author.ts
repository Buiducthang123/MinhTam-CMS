import type { IBook } from "./book";

export interface IAuthor {
    id: number;
    name: string;
    avatar: string;
    description: string;
    books?: IBook[];
}