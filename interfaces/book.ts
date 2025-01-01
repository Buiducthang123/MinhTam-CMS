import type { IAuthor } from "./author";
import type { ICategory } from "./category";
import type { IPublisher } from "./publisher";

export interface IDiscountTier {
    id: number;
    book_id: number;
    minimum_quantity: number;
}

export interface IBook {
    id: number;
    category_id: number;
    publisher_id: number;
    promotion_id: number | null;
    title: string;
    slug: string;
    ISBN: string;
    cover_image: string;
    thumbnail: string[];
    short_description: string;
    description: string;
    is_sale: number;
    price: number;
    discount: number;
    pages: number;
    weight: number;
    height: number;
    dimension_length: number;
    dimension_width: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    quantity?: number;
    authors?: IAuthor[];
    discount_tiers?: IDiscountTier[];
    publisher?: IPublisher;
    category?: ICategory;
}