// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Cookies from "js-cookie";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";

// const AccessToken = () => {
//   const { code } = useParams();
//   console.log(code);

//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const code = searchParams.get("code");

//     if (code) {
//       console.log("OAuth Code:", code);

//       // 👉 You can now send this code to your backend to get an access token
//       // axios.post('/api/token', { code })...

//       let codes="code="+code;

//       const response=axios.get(`http://localhost:8080/oauth/callback/${codes}`)
//       console.log(response)
//     }
//   }, [searchParams]);

//   return <h1>Hello</h1>;
// };

// export default AccessToken;
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";

const AccessToken = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      const cookieOptions = {
        expires: 7,
        secure: true,
        sameSite: "strict",
      };
      Cookies.set("hmrc_token", code, cookieOptions);
      console.log("Token stored in cookie:", code);
      navigate("/reports");
    }
  }, [code, navigate]);

  return <Loader/>
};

export default AccessToken;
