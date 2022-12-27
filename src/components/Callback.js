import React, { useEffect } from 'react';
import authConfig from '../authConfig';

const Callback = ({ auth, setAuth, userManager, userInfo, setUserInfo, handleLogout }) => {

  useEffect(() => {
    if (auth === null) {
      console.log("Inside CallbackJS useEffect........")

      userManager.signinRedirectCallback().then((user) => {
        console.log(user);
        if (user) {
          console.log("AppJS-> useEffect -> user is not null....")
          setAuth(true);
          const access_token = user.access_token;
          // Make a request to the user info endpoint using the access token
          fetch(authConfig.userinfo_endpoint, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          })
            .then(response => response.json())
            .then(userInfo => {
              console.log(userInfo);
              setUserInfo(userInfo);
            });
        } else {
          setAuth(false);
        }
      }).catch((error) => {
        console.log(error);
        setAuth(false);
      });
    }
  }, [auth, userManager, setAuth]);


  if (auth === true && userInfo) {
    console.log(userInfo);
    return (
      <div>
        <h1>Welcome, {userInfo.name}!</h1>
        <h2>Your Zitadel Profile Information</h2>
        <h3>Name:  {userInfo.name}</h3>
        <h3>Email: {userInfo.email}</h3>
        <h3>Email Verified: {userInfo.email_verified? "Yes": "No"}</h3>
        <h3>Locale: {userInfo.locale}</h3>

        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }
  else {
      return <div>Loading...</div>;
    }

};

export default Callback;

