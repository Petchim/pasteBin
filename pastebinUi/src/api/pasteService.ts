import axios from 'axios';
import { CreatePasteRequest, CreatePasteResponse, PasteResponse } from './types';

// Use Vercel environment variable for backend URL
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Create a new paste
export const createPaste = async (data: CreatePasteRequest): Promise<CreatePasteResponse> => {
    try {
        const response = await apiClient.post<CreatePasteResponse>('/paste-bin/v1/create-form', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to create paste');
        }
        throw new Error('An unexpected error occurred');
    }
};

// Fetch a paste by ID
export const getPaste = async (id: string): Promise<PasteResponse> => {
    try {
        const response = await apiClient.get<PasteResponse>(`/paste-bin/v1/paste/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Paste not found or has expired');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch paste');
        }
        throw new Error('An unexpected error occurred');
    }
};
