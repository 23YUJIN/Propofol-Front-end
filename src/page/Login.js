import { React, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/SRC";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { setRefreshTokenToCookie, setAccessTokenToCookie, getRefreshToken, getAccessToken } from "../utils/auth.js";
import { setUserDataCookie } from "../utils/user";

const cookies = new Cookies();

/*
export function setRefreshTokenToCookie(refresh_token) { //나중에 로그아웃 시 쿠키 삭제하는 코드 추가!!
  cookies.set('refresh_token', refresh_token, { sameSite: 'strict' });
}
*/

function Login() {
  const postLogin = async ({ data, setLoginError }) => {
    await axios
      .post(SERVER_URL + "/user-service/auth/login", data) //나중에 경로 /user-service/ 추가하기
      .then((res) => {
        setLoginError(false);
        if (res.data.data.accessToken != null) {
          setAccessTokenToCookie(res.data.data.accessToken);
          setRefreshTokenToCookie(res.data.data.refreshToken);
          moveToMain(res.data.data.accessToken);
        }
      })
      .catch((err) => {
        setLoginError(true);
        if (err.response) {
          console.log(err.response.data);
        }
      });
  };

  function moveToMain(at) {
    axios
      .get(SERVER_URL + "/user-service/api/v1/members", at)
      .then((res) => {
        setUserDataCookie(res.data.data);
        navigate("/");
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        }
      });
  }

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  return (
    <div class="w-full font-test">
      <div className="Header" class="pt-10">
        <div class="mt-20 text-center">
          <h1 class="text-black font-rumpi text-6xl">Propofol</h1>
          <p class="text-2xl opacity-90 font-ltest text-gray-500">
            ( <a class="font-sbtest text-black ">Pro</a>file + <a class="font-sbtest text-black ">Po</a>rt
            <a class="font-sbtest text-black">fol</a>io )
          </p>
        </div>
      </div>
      <div className="Login" class="flex flex-col gap-7 mt-16 ">
        <input
          class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 py-3 px-3 border rounded-lg bg-gray-50 focus:outline-0 text-xl font-ltest min-w-[20rem]"
          placeholder="아이디"
          onChange={onEmailHandler}
          type="text"
        />
        <input
          class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 py-3 px-3 border rounded-lg bg-gray-50 focus:outline-0 text-xl font-ltest min-w-[20rem]"
          placeholder="비밀번호"
          onChange={onPasswordHandler}
          type="password"
        />
        <button
          class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 rounded-lg bg-black text-white py-3 text-2xl font-sbtest min-w-[20rem]"
          onClick={() => {
            const data = {
              email: email,
              password: password,
            };
            if (email.length === 0) {
              setEmailError(true);
            } else {
              setEmailError(false);
            }
            if (password.length === 0) {
              setPwdError(true);
            } else {
              setPwdError(false);
            }
            postLogin({ data, setLoginError });
          }}
        >
          Login
        </button>
        <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 mt-5 pb-5 flex justify-center gap-2 text-gray-500 font-ltest text-center min-w-[20rem]">
          <div>아직 계정이 없다면? </div>
          <button
            onClick={() => {
              navigate("/register");
            }}
          >
            회원가입{">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
