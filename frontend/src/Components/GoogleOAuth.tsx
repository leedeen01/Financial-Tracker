import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleOAuth = () => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const decoded = jwtDecode(credentialResponse?.credential as string);
        console.log(decoded);
      }}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleOAuth;
