import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Collection from './collections/collection';
import AlbumGalleryWrapper from './albums/album-gallery-wrapper';
import Login from './auth/login';
import About from '@src/pages/about';
import Home from '@src/pages/home';
import Groups from '@src/pages/collections';

// eslint-disable-next-line react-refresh/only-export-components
export const titleMap: Record<string, string> = {
    "/": "Iain Griesdale",
    "/about": "About | Iain Griesdale",
    "/login": "Login | Iain Griesdale",
    "/albums": "Albums | Iain Griesdale",
    "/collections": "Collections | Iain Griesdale",
    "/collections/robotics": "Robotics | Iain Griesdale",
};

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album/:albumId" element={<AlbumGalleryWrapper />} />
            <Route path="/albums" element={<Collection collection_id="main-collection"/>} />
            <Route path="/collections" element={<Groups />} />
            <Route path="/collections/robotics" element={<Collection collection_id="robotics"/>} />
            <Route path="/collections/tmb" element={<Collection collection_id="tmb"/>} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

type GtagWindow = Window & { gtag?: (command: string, id?: string | undefined, params?: Record<string, unknown>) => void };

export function LocationTracker() {
    const location = useLocation();

    useEffect(() => {
        // Google Analytics page tracking (if configured)
        const gw = window as GtagWindow;
        const gaId = import.meta.env.VITE_GA_ID as string | undefined;
        if (gaId && typeof gw.gtag === 'function') {
            gw.gtag('config', gaId, { page_path: location.pathname });
        }

        // Set document title using lookup table
        document.title = titleMap[location.pathname] || "Iain Griesdale";
    }, [location]);

    return null;
}
