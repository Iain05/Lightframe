import './css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAutoLogout } from './hooks/use-auto-logout';

import Navbar from './navbar';
import Footer from './footer';
import AlbumGallery from './albums/album-gallery';
import AlbumGalleryWrapper from './albums/album-gallery-wrapper';
import Collection from './collections/collection';
import Login from './auth/login';

const queryClient = new QueryClient();

function App() {
    // Check for token expiration every 5 minutes
    useAutoLogout(5);
    
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/events" element={<Collection collection_id="main-collection"/>} />
                        <Route path="/" element={<AlbumGallery 
                            albumId="portfolio" 
                            layout="columns" 
                            enableOverlay={false} 
                        />} />
                        <Route path="/album/:albumId" element={<AlbumGalleryWrapper />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

export default App;
