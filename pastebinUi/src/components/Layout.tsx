/**
 * Layout Component
 * Provides a consistent header, main content area, and footer across all pages
 */

import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();

    return (
        <div className="layout">
            {/* Header with navigation */}
            <header className="header">
                <div className="header-content">
                    <h1 className="logo">
                        <Link to="/">📋 Pastebin Lite</Link>
                    </h1>
                    <nav className="nav">
                        <Link
                            to="/"
                            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
                        >
                            Create Paste
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main content area */}
            <main className="main-content">
                {children}
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>Built with React + TypeScript + Vite</p>
            </footer>
        </div>
    );
};

export default Layout;
