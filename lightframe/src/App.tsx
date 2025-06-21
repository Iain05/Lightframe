import './css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from './navbar';
import AlbumGallery from './albums/album-gallery';
import AlbumGalleryWrapper from './albums/album-gallery-wrapper';
import Collection from './collections/collection';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/events" element={<Collection />} />
                        <Route path="/" element={<AlbumGallery albumId="portfolio" layout="columns" />} />
                        <Route path="/album/:albumId" element={<AlbumGalleryWrapper />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

export default App;
