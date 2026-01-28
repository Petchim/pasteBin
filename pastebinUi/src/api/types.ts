/**
 * TypeScript interfaces for API requests and responses
 * These types ensure type safety when working with the Pastebin API
 */

// Request body for creating a new paste
export interface CreatePasteRequest {
    content: string;
    expires_in_seconds: number | null;
    max_views: number | null;
}

// Data object in create paste response
export interface CreatePasteData {
    id: string;
    url: string;
}

// API wrapper for create paste response
export interface CreatePasteResponse {
    message: string;
    responseCode: number;
    status: string;
    data: CreatePasteData;
}

// Data object in fetch paste response
export interface PasteData {
    content: string;
    expires_at: string | null;
    remaining_views: number | null;
}

// API wrapper for fetch paste response
export interface PasteResponse {
    message: string;
    responseCode: number;
    status: string;
    data: PasteData | null;
}
