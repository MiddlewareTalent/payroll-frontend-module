import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const AccessToken = () => {
  const { code } = useParams();
  console.log(code);

  useEffect(() => {
    if (code) {
      const cookieOptions = {
        expires: 8,
        secure: true,
        sameSite: "strict",
      };

      // ✅ Set cookie
      Cookies.set("token", code, cookieOptions);

      // ✅ Print token info in desired format
      console.log("token information:", {
        token: code,
        ...cookieOptions,
      });

      
    }
  }, [code]);

  return <h1>Hello</h1>;
};

export default AccessToken;
