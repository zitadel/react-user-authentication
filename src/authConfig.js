const authConfig = {
  authority: "http://localhost:8888/", //Replace with your issuer URL
  client_id: "325757962121445379", //Replace with your client id
  redirect_uri: "http://localhost:3000/callback",
  response_type: "code",
  scope: "openid profile email",
  post_logout_redirect_uri: "http://localhost:3000",
  userinfo_endpoint: "http://localhost:8888/oidc/v1/userinfo", //Replace with your user-info endpoint
  response_mode: "query",
  code_challenge_method: "S256",
};

export default authConfig;
