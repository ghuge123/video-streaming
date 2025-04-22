import { useState } from "react";
import Navbar from "./Navbar";
import MainBody from "./MainBody";
import Alert from "./Alert";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";

export default function Home() {
    const [sidebar, setSidebar] = useState(true);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

    const [alert, setAlert] = useState(null);

    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type,
        });

        setTimeout(() => {
            setAlert(null);
        }, 2000);
    };

    return (
        <>
            <Router>
                <Navbar toggleSidebar={toggleSidebar} />
                <Alert alert={alert} />
                    <Routes>
                        <Route path="/" element={<MainBody sidebar={sidebar} showAlert={showAlert} />}></Route>
                        <Route path="/login" element={<Login showAlert={showAlert}></Login>} />
                    </Routes>
            </Router>

        </>
    )
}