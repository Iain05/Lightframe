import './css/App.css'

import { BrowserRouter } from 'react-router-dom';

import Navbar from './navbar';
import Portfolio from './portfolio';

function App() {


    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>

            <Portfolio />

        </div>
    )
}

export default App
