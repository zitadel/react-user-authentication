import React, { useState, useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import './App.css';
import authConfig from './authConfig';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

function App() {
    const userManager = new UserManager({
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        ...authConfig
    });

    function authorize(codeChallenge) {
        console.log("Inside AppJS authorize........")
        userManager.signinRedirect({ state: 'a2123a67ff11413fa19217a9ea0fbad5', codeChallenge });
    }

    function clearAuth() {
        console.log("Inside AppJS clearAuth........")
        userManager.signoutRedirect();
    }

    const [authenticated, setAuthenticated] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        console.log("Inside AppJS useEffect........")
        console.log(userManager);
        console.log(userManager.getUser);

        userManager.getUser().then((user) => {
            console.log(user);
            if (user) {
                console.log("AppJS-> useEffect -> user is not null....")
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
        });
    }, [userManager]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login auth={authenticated} handleLogin={authorize}/>} />
                <Route path='/callback' element={<Callback
                    auth={authenticated}
                    setAuth={setAuthenticated}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    handleLogout={clearAuth}
                    userManager={userManager}
                />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

