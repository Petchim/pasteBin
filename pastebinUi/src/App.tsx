/**
 * Main Application Component
 * Sets up React Router with routes for CreatePaste and ViewPaste pages
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CreatePaste from './pages/CreatePaste';
import ViewPaste from './pages/ViewPaste';
import WelcomeLoader from './components/WelcomeLoader';
import { checkServerHealth } from './api/pasteService';
import './styles/global.css';

function App() {
    const [isServerReady, setIsServerReady] = useState(false);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Keep pinging the health endpoint until it responds
                while (true) {
                    try {
                        await checkServerHealth();
                        setIsServerReady(true);
                        break;
                    } catch (err) {
                        // Wait 3 seconds before next retry
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }
            } catch (error) {
                console.error('Failed to check server health:', error);
            }
        };

        checkHealth();
    }, []);

    if (!isServerReady) {
        return <WelcomeLoader />;
    }

    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Home page - Create new paste */}
                    <Route path="/" element={<CreatePaste />} />

                    {/* View paste by ID */}
                    <Route path="/paste/:id" element={<ViewPaste />} />
                </Routes>
            </Layout>
        </Router>
    );
}


export default App;
