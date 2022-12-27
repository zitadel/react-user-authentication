import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { generateCodeVerifier, generateCodeChallenge } from './utils';

const Login = ({ auth, handleLogin, userManager}) => {
  const [codeVerifier, setCodeVerifier] = useState(null);

  useEffect(() => {
    // Generate a code verifier
    const newCodeVerifier = generateCodeVerifier();
    setCodeVerifier(newCodeVerifier);
  }, []);

  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && (
        <div>
          <h1>Welcome!</h1>
          <button
            onClick={() => {
              // To use the codeVerifier in the authorization request, you'll
              // need to generate a code challenge from it and pass it along
              // as the `code_challenge` parameter in the authorization request
              const codeChallenge = generateCodeChallenge(codeVerifier);

              // Perform the authorization request, including the code challenge
              handleLogin(codeChallenge);
            }}
          >
            Please log in.
          </button>
        </div>
      )}
      {auth && <Navigate to="/callback" />}
    </div>
  );
};

export default Login;

