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
import About from '@src/pages/about';
import Home from './pages/home';

const queryClient = new QueryClient();

function App() {
    // Check for token expiration every 5 minutes
    useAutoLogout(5);
    
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/events" element={<Collection collection_id="main-collection"/>} />
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

export default App;
