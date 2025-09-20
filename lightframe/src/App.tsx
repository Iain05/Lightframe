import './css/App.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAutoLogout } from './hooks/use-auto-logout';

import Navbar from './navbar';
import Footer from './footer';
import { AppRoutes, LocationTracker } from './route-table';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
    // Check for token expiration every 5 minutes
    useAutoLogout(5);

    useEffect(() => {
        const pos = sessionStorage.getItem('scrollPosition');
        if (pos) {
            window.scrollTo(0, Number(pos));
            sessionStorage.removeItem('scrollPosition');
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <BrowserRouter>
                    <LocationTracker />
                    <Navbar />
                    <div className="main-content">
                        <AppRoutes />
                    </div>
                    <Footer />
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

export default App;
