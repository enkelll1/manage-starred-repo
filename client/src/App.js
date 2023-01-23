import {LoginPage} from "./components/LoginPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {StarredList} from './components/StarredList';


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/repo" element={<StarredList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;