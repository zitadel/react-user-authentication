import { Navigate } from "react-router-dom";

const Login = ({ auth, handleLogin, userManager }) => {
  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && (
        <div>
          <h1>Welcome!</h1>
          <button
            onClick={() => {
              // Perform the authorization request, including the code challenge
              handleLogin();
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
