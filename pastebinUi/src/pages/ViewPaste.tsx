/**
 * ViewPaste Page
 * Displays a paste by ID with metadata (remaining views, expiration)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaste } from '../api/pasteService';
import { PasteData } from '../api/types';
import Toast, { ToastType } from '../components/Toast';
import '../styles/ViewPaste.css';

const ViewPaste = () => {
    // Get paste ID from URL
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State management
    const [paste, setPaste] = useState<PasteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [is404, setIs404] = useState(false);

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('success');

    /**
     * Fetch paste data when component mounts or ID changes
     */
    useEffect(() => {
        const fetchPaste = async () => {
            if (!id) {
                setError('No paste ID provided');
                setIs404(true);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                setIs404(false);

                // Fetch paste from API
                const response = await getPaste(id);

                // Check if response is successful and has data
                if (response.status === 'success' && response.data) {
                    setPaste(response.data);
                } else if (response.responseCode === 404 || response.status === 'error') {
                    // Handle 404 or error response
                    setIs404(true);
                    setError('Paste not found or has expired');
                } else {
                    throw new Error('Failed to load paste');
                }
            } catch (err) {
                // Handle errors (not found, expired, etc.)
                const errorMessage = err instanceof Error ? err.message : 'Failed to load paste';
                setError(errorMessage);
                setIs404(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id]);

    /**
     * Format expiration date for display
     */
    const formatExpirationDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Navigate back to create page
     */
    const handleCreateNew = () => {
        navigate('/');
    };

    /**
     * Copy paste content to clipboard
     */
    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(paste?.content || '');
            setToastMessage('Content copied to clipboard!');
            setToastType('success');
            setShowToast(true);
        } catch (err) {
            setToastMessage('Failed to copy content');
            setToastType('error');
            setShowToast(true);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="view-paste-container">
                <div className="loading-card">
                    <div className="spinner"></div>
                    <p>Loading paste...</p>
                </div>
            </div>
        );
    }

    // 404 Error state - Clean design without raw backend message
    if (is404 || error) {
        return (
            <div className="view-paste-container">
                <div className="error-404-card">
                    <div className="error-404-icon">404</div>
                    <h2 className="error-404-title">Paste Not Found</h2>
                    <p className="error-404-text">
                        This paste doesn't exist or has expired.
                    </p>
                    <div className="error-404-actions">
                        <button onClick={handleCreateNew} className="btn btn-primary">
                            Create New Paste
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success state - display paste
    return (
        <div className="view-paste-container">
            <div className="paste-card">
                {/* Header with metadata */}
                <div className="paste-header">
                    <h2>Paste Content</h2>
                    <div className="paste-metadata">
                        {paste?.remaining_views !== null && paste?.remaining_views !== undefined && (
                            <span className="badge badge-views">
                                👁 {paste.remaining_views} views remaining
                            </span>
                        )}
                        {paste?.expires_at && (
                            <span className="badge badge-expires">
                                ⏰ Expires: {formatExpirationDate(paste.expires_at)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Paste content */}
                <div className="paste-content">
                    <pre>{paste?.content}</pre>
                </div>

                {/* Actions */}
                <div className="paste-actions">
                    <button onClick={handleCreateNew} className="btn btn-secondary">
                        Create New Paste
                    </button>
                    <button
                        onClick={handleCopyContent}
                        className="btn btn-outline"
                    >
                        📋 Copy to Clipboard
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                    duration={3000}
                />
            )}
        </div>
    );
};

export default ViewPaste;
