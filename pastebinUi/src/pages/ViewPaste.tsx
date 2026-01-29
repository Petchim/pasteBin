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

/**
 * Custom hook for countdown timer
 * Calculates time remaining until expiry and updates every second
 */
const useCountdown = (expiresAt: string | null) => {
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!expiresAt) {
            setTimeRemaining(null);
            return;
        }

        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const remaining = expiry - now;

            if (remaining <= 0) {
                setTimeRemaining(0);
                setIsExpired(true);
            } else {
                setTimeRemaining(remaining);
                setIsExpired(false);
            }
        };

        // Calculate immediately
        calculateTimeRemaining();

        // Update every second
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    return { timeRemaining, isExpired };
};

/**
 * Format milliseconds to HH:MM:SS or MM:SS
 */
const formatCountdown = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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

    // Countdown timer
    const { timeRemaining, isExpired } = useCountdown(paste?.expires_at || null);

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

    // 404 Error state or Expired state - Clean design without raw backend message
    if (is404 || error || isExpired) {
        return (
            <div className="view-paste-container">
                <div className="error-404-card">
                    <div className="error-404-icon">{isExpired ? '⏰' : '404'}</div>
                    <h2 className="error-404-title">{isExpired ? 'Paste Expired' : 'Paste Not Found'}</h2>
                    <p className="error-404-text">
                        {isExpired
                            ? 'This paste has expired and is no longer available.'
                            : 'This paste doesn\'t exist or has expired.'}
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
                        {paste?.expires_at && timeRemaining !== null && (
                            <span
                                className={`badge badge-expires ${timeRemaining < 60000 ? 'badge-expires-urgent' : ''
                                    }`}
                            >
                                ⏰ Expires in: {formatCountdown(timeRemaining)}
                            </span>
                        )}
                        {paste?.expires_at && timeRemaining === null && (
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
