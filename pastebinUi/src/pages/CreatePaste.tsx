/**
 * CreatePaste Page
 * Allows users to create a new paste with optional expiration and view limits
 */

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaste } from '../api/pasteService';
import { CreatePasteRequest } from '../api/types';
import Modal from '../components/Modal';
import Toast, { ToastType } from '../components/Toast';
import '../styles/CreatePaste.css';

const CreatePaste = () => {
    // Form state
    const [content, setContent] = useState('');
    const [expiresInSeconds, setExpiresInSeconds] = useState('');
    const [maxViews, setMaxViews] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [pasteUrl, setPasteUrl] = useState('');
    const [pasteId, setPasteId] = useState('');

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('success');

    // Copy button state
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate content
        if (!content.trim()) {
            setError('Please enter some content');
            return;
        }

        // Reset error state
        setError('');
        setLoading(true);

        try {
            // Prepare request data
            const requestData: CreatePasteRequest = {
                content: content.trim(),
                expires_in_seconds: expiresInSeconds ? parseInt(expiresInSeconds) : null,
                max_views: maxViews ? parseInt(maxViews) : null,
            };

            // Call API to create paste
            const response = await createPaste(requestData);

            // Check if response is successful
            if (response.status === 'success' && response.data) {
                // Extract paste ID from backend URL
                // Backend returns URL like: /p/87a88cc2
                // We need to extract: 87a88cc2
                const backendUrl = response.data.url;
                const pasteIdFromUrl = backendUrl.split('/').pop() || response.data.id;

                // Construct frontend URL
                // Frontend URL format: http://localhost:3000/paste/{id}
                const frontendUrl = `${window.location.origin}/paste/${pasteIdFromUrl}`;

                // Store paste data
                setPasteId(pasteIdFromUrl);
                setPasteUrl(frontendUrl);

                // Show modal popup
                setShowModal(true);

                // Show success toast
                setToastMessage(response.message || 'Paste created successfully!');
                setToastType('success');
                setShowToast(true);

                // Clear form
                setContent('');
                setExpiresInSeconds('');
                setMaxViews('');
            } else {
                throw new Error('Failed to create paste');
            }
        } catch (err) {
            // Handle errors
            const errorMessage = err instanceof Error ? err.message : 'Failed to create paste';
            setError(errorMessage);

            // Show error toast
            setToastMessage(errorMessage);
            setToastType('error');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Copy URL to clipboard
     */
    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(pasteUrl);
            setCopied(true);

            // Show copy success toast
            setToastMessage('URL copied to clipboard!');
            setToastType('success');
            setShowToast(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            setToastMessage('Failed to copy URL');
            setToastType('error');
            setShowToast(true);
        }
    };

    /**
     * Navigate to view the created paste
     */
    const handleViewPaste = () => {
        setShowModal(false);
        navigate(`/paste/${pasteId}`);
    };

    /**
     * Close modal and reset
     */
    const handleCloseModal = () => {
        setShowModal(false);
        setCopied(false);
    };

    /**
     * Close toast after it's shown
     */
    const handleToastClose = () => {
        setShowToast(false);

        // Auto-close modal after toast is dismissed
        if (showModal && toastType === 'success') {
            setTimeout(() => {
                setShowModal(false);
            }, 500);
        }
    };

    return (
        <div className="create-paste-container">
            {/* Create form */}
            <div className="create-card">
                <h2>Create New Paste</h2>
                <p className="subtitle">Share text snippets with optional expiration and view limits</p>

                <form onSubmit={handleSubmit} className="create-form">
                    {/* Content textarea */}
                    <div className="form-group">
                        <label htmlFor="content">
                            Paste Content <span className="required">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your text here..."
                            rows={12}
                            className="form-textarea"
                            disabled={loading}
                        />
                    </div>

                    {/* Optional settings */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expires">
                                Expires In (seconds)
                            </label>
                            <input
                                id="expires"
                                type="number"
                                value={expiresInSeconds}
                                onChange={(e) => setExpiresInSeconds(e.target.value)}
                                placeholder="e.g., 3600 for 1 hour"
                                min="1"
                                className="form-input"
                                disabled={loading}
                            />
                            <small className="form-hint">Leave empty for no expiration</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="maxViews">
                                Max Views
                            </label>
                            <input
                                id="maxViews"
                                type="number"
                                value={maxViews}
                                onChange={(e) => setMaxViews(e.target.value)}
                                placeholder="e.g., 10"
                                min="1"
                                className="form-input"
                                disabled={loading}
                            />
                            <small className="form-hint">Leave empty for unlimited views</small>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠</span>
                            {error}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-large"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Paste'}
                    </button>
                </form>
            </div>

            {/* Success Modal */}
            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="modal-header">
                    <div className="modal-success-icon">✓</div>
                    <h2 className="modal-title">Paste Created Successfully!</h2>
                    <p className="modal-subtitle">Your paste is ready to share</p>
                </div>

                <div className="modal-body">
                    <div className="modal-url-container">
                        <label className="modal-url-label">Paste URL:</label>
                        <div className="modal-url-display">
                            <span className="modal-url-text">{pasteUrl}</span>
                            <button
                                className={`modal-copy-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopyUrl}
                            >
                                {copied ? '✓ Copied!' : '📋 Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={handleViewPaste} className="btn btn-primary">
                        View Paste
                    </button>
                    <button onClick={handleCloseModal} className="btn btn-secondary">
                        Create Another
                    </button>
                </div>
            </Modal>

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={handleToastClose}
                    duration={3000}
                />
            )}
        </div>
    );
};

export default CreatePaste;
