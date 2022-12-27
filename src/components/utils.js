// This function generates a code verifier for the PKCE flow
export const generateCodeVerifier = () => {
    const buffer = new Uint8Array(32);
    window.crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode(...buffer));
  };
  
  // This function generates a code challenge from the code verifier
  export const generateCodeChallenge = (codeVerifier) => {
    const challengeBuffer = new TextEncoder().encode(codeVerifier);
    return sha256(challengeBuffer).then(async (hashedBuffer) => {
      const codeChallenge = base64UrlEncode(hashedBuffer);
      return codeChallenge;
    });
  };
  
  // This function encodes the code challenge in base64url encoding
  const base64UrlEncode = (arrayBuffer) => {
    const base64 = window.btoa(
      new Uint8Array(arrayBuffer).reduce(
        (s, b) => s + String.fromCharCode(b),
        '',
      ),
    );
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  
  // This function hashes the code verifier using SHA-256
  const sha256 = (buffer) => {
    return crypto.subtle.digest('SHA-256', buffer);
  };
  