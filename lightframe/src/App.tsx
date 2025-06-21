import './css/App.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from './navbar';
import AlbumGallery from './album';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
                <AlbumGallery albumName="portfolio" />
            </div>
        </QueryClientProvider>
    );
}

export default App;
