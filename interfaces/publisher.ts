import type { IBook } from "./book";

export interface IPublisher {
    id: number;
    name: string;
    avatar: string;
    description: string;
    books?: IBook[];
}