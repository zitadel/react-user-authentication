import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authConfig from "../authConfig";

const Callback = ({
  auth,
  setAuth,
  userManager,
  userInfo,
  setUserInfo,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Function to fetch user info
    const fetchUserInfo = async (accessToken) => {
      try {
        const response = await fetch(authConfig.userinfo_endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user info: ${response.status}`);
        }
        const data = await response.json();
        console.log("User info fetched:", data);
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Failed to load user information.");
        setAuth(false);
        navigate("/");
      }
    };

    // Check if user is already authenticated or processing callback
    const handleAuth = async () => {
      try {
        // First, check if there's an OIDC callback (e.g., code in URL)
        if (window.location.search.includes("code=")) {
          console.log("Processing OIDC callback:", window.location.href);
          const user = await userManager.signinRedirectCallback();
          if (user) {
            console.log("User authenticated:", user);
            setAuth(true);
            await fetchUserInfo(user.access_token);
          } else {
            console.warn("No user returned from signinRedirectCallback");
            setAuth(false);
            navigate("/");
          }
        } else {
          // No callback, check if user is already authenticated
          const user = await userManager.getUser();
          if (user && !user.expired) {
            console.log("User already authenticated:", user);
            setAuth(true);
            if (!userInfo) {
              // Fetch user info if not already set
              await fetchUserInfo(user.access_token);
            }
          } else {
            console.log("No authenticated user found");
            setAuth(false);
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error during auth handling:", error);
        setError(`Authentication failed: ${error.message}`);
        setAuth(false);
        if (error.message !== "No state in response") {
          navigate("/");
        }
      } finally {
        setLoading(false); // Done loading
      }
    };

    if (auth === null) {
      handleAuth();
    } else if (auth === true && !userInfo && !error) {
      // If authenticated but no userInfo, fetch it
      userManager.getUser().then((user) => {
        if (user && !user.expired) {
          fetchUserInfo(user.access_token);
        } else {
          setAuth(false);
          navigate("/");
        }
      });
    } else {
      setLoading(false); // No action needed, stop loading
    }
  }, [auth, userManager, setAuth, setUserInfo, navigate, userInfo]);

  // Debugging logs
  console.log("auth:", auth);
  console.log("userInfo:", userInfo);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error if present
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Return to Login</button>
      </div>
    );
  }

  // Render user info if authenticated and userInfo is available
  if (auth === true && userInfo != null) {
    return (
      <div>
        <h1>Welcome, {userInfo.name}!</h1>
        <h2>Your ZITADEL Profile Information</h2>
        <h3>Name: {userInfo.name}</h3>
        <h3>Email: {userInfo.email}</h3>
        <h3>Email Verified: {userInfo.email_verified ? "Yes" : "No"}</h3>
        <h3>Locale: {userInfo.locale}</h3>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  // Default case: not authenticated
  return (
    <div>
      <h1>You are Logged Out</h1>
      <button onClick={() => navigate("/")}>Go to Login</button>
    </div>
  );
};

export default Callback;
