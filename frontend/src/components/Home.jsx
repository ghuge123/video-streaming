import { useState } from "react";
import Navbar from "./Navbar";
import MainBody from "./MainBody";
import Alert from "./Alert";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import GetVideo from "./GetVideo";
import Channel from "./Channel";
import Search from "./Search";

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
                <Navbar toggleSidebar={toggleSidebar} showAlert={showAlert} />
                <Alert alert={alert} />
                    <Routes>
                        <Route path="/" element={<MainBody sidebar={sidebar} showAlert={showAlert} />}></Route>
                        <Route path="/login" element={<Login showAlert={showAlert}></Login>} />
                        <Route path="/signup" element={<Signup showAlert={showAlert}></Signup>} />
                        <Route path="/getVideo" element={<GetVideo sidebar={sidebar} showAlert={showAlert}></GetVideo>} />
                        <Route path="/channel" element= {<Channel sidebar={sidebar} showAlert={showAlert}></Channel>}/>
                        <Route path="/search" element= {<Search sidebar={sidebar} showAlert={showAlert}></Search>}></Route>
                    </Routes>
            </Router>

        </>
    )
}