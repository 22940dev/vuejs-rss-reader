import {Item} from "rss-parser";

export interface SavedFeed {
    id: number;
    url: string;
    title?: string;
    items?: Item[];
    error?: string;
}