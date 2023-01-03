import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Callback from "./components/Callback";
import authConfig from "./authConfig";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

function App() {
  const userManager = new UserManager({
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    ...authConfig,
  });

  function authorize() {
    userManager.signinRedirect({ state: "a2123a67ff11413fa19217a9ea0fbad5" });
  }

  function clearAuth() {
    userManager.signoutRedirect();
  }

  const [authenticated, setAuthenticated] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    userManager.getUser().then((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [userManager]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login auth={authenticated} handleLogin={authorize} />}
        />
        <Route
          path="/callback"
          element={
            <Callback
              auth={authenticated}
              setAuth={setAuthenticated}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleLogout={clearAuth}
              userManager={userManager}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
