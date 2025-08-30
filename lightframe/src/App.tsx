import './css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAutoLogout } from './hooks/use-auto-logout';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './navbar';
import Footer from './footer';
import AlbumGalleryWrapper from './albums/album-gallery-wrapper';
import Collection from './collections/collection';
import Login from './auth/login';
import About from '@src/pages/about';
import Home from './pages/home';

declare global {
    interface Window {
        gtag?: (command: string, targetId: string, config?: { [key: string]: string | number | boolean }) => void;
    }
}

const queryClient = new QueryClient();

function App() {
    // Check for token expiration every 5 minutes
    useAutoLogout(5);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <BrowserRouter>
                    <LocationTracker />
                    <Navbar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/albums" element={<Collection collection_id="main-collection"/>} />
                            <Route path="/robotics" element={<Collection collection_id="robotics"/>} />
                            <Route path="/" element={<Home />} />
                            <Route path="/album/:albumId" element={<AlbumGalleryWrapper />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                    <Footer />
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

const titleMap: Record<string, string> = {
    "/albums": "Albums | Iain Griesdale",
    "/about": "About | Iain Griesdale",
    "/login": "Login | Iain Griesdale",
    "/": "Iain Griesdale",
};

function LocationTracker() {
    const location = useLocation();

    useEffect(() => {
        // Google Analytics page tracking
        if (window.gtag) {
            window.gtag('config', `${import.meta.env.VITE_GA_ID}`, {
                page_path: location.pathname,
            });
        }
        // Set document title using lookup table
        document.title = titleMap[location.pathname] || "Iain Griesdale";
    }, [location]);

    return null;
}

export default App;
