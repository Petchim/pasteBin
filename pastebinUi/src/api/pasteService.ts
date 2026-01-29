/**
 * API Service for Pastebin operations
 * Handles all HTTP requests to the backend API using Axios
 */

import axios from 'axios';
import { CreatePasteRequest, CreatePasteResponse, PasteResponse } from './types';

// Create an Axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    // baseURL: "http://localhost:8080",
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

/**
 * Create a new paste
 * @param data - The paste content and optional expiration settings
 * @returns Promise with the full API response
 */
export const createPaste = async (
    data: CreatePasteRequest
): Promise<CreatePasteResponse> => {
    try {
        const response = await apiClient.post<CreatePasteResponse>(
            '/paste-bin/v1/create-form',
            data
        );
        return response.data;
    } catch (error) {
        // Re-throw the error so components can handle it
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || 'Failed to create paste'
            );
        }
        throw new Error('An unexpected error occurred');
    }
};

/**
 * Fetch a paste by its ID
 * @param id - The unique paste identifier
 * @returns Promise with the full API response
 */
export const getPaste = async (id: string): Promise<PasteResponse> => {
    try {
        const response = await apiClient.get<PasteResponse>(
            `/paste-bin/v1/paste/${id}`
        );
        return response.data;
    } catch (error) {
        // Handle different error scenarios
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Paste not found or has expired');
            }
            throw new Error(
                error.response?.data?.message || 'Failed to fetch paste'
            );
        }
        throw new Error('An unexpected error occurred');
    }
};
/**
 * Check if the server is healthy (used for cold start detection)
 * @returns Promise that resolves if the server is healthy
 */
export const checkServerHealth = async (): Promise<void> => {
    await apiClient.get('/paste-bin/v1/health');
};
