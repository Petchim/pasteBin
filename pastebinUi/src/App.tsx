/**
 * Main Application Component
 * Sets up React Router with routes for CreatePaste and ViewPaste pages
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CreatePaste from './pages/CreatePaste';
import ViewPaste from './pages/ViewPaste';
import './styles/global.css';

function App() {
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
