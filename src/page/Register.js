import { React, useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/SRC";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [certi, setCerti] = useState("");

  /*입력*/
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nickNameInput, setNickNameInput] = useState("");
  const [pwdInput, setPwdInput] = useState("");
  const [pwdCheckInput, setPwdCheckInput] = useState("");
  const [emailCheckInput_left, setEmailCheckInput_left] = useState("");
  const [emailCheckInput_right, setEmailCheckInput_right] = useState("");
  /*메시지*/
  const [nickNameMsg, setNickNameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailCheckMsg, setEmailCheckMsg] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdCheckMsg, setPwdCheckMsg] = useState("");
  /*유효성*/
  const [nickNameVaild, setNickNameVaild] = useState(false);
  const [emailVaild, setEmailVaild] = useState(false);
  const [pwdVaild, setPwdVaild] = useState(false);
  const [pwdCheckVaild, setPwdCheckVaild] = useState(false);
  const [emailCheckValid, setEmailCheckValid] = useState(false);

  function postRegister(data) {
    axios
      .post(SERVER_URL + "/user-service/auth/join", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        alert("회원가입에 성공하였습니다.");
        navigate("/");
      })
      .catch((err) => {
        console.log(err.request);
        alert("회원가입에 실패했습니다. 잠시 후에 다시 시도해주세요.");
      });
  }

  // 로그인, 회원가입 과정 JWT X
  function postEmail(data) {
    axios
      .post(SERVER_URL + "/user-service/auth/email", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setEmailVaild(true);
        axios
          .post(SERVER_URL + "/user-service/auth/mailCheck", data)
          .then((res) => {
            setCerti(res.data.data);
            setEmailMsg("사용 가능한 이메일입니다.");
          })
          .catch((err) => {
            console.log(err.response);
            setEmailMsg("인증 번호를 가져오는 과정에서 에러가 발생했습니다. 다시 시도해주세요.");
          });
      })
      .catch((err) => {
        console.log(err.request);
        setEmailVaild(false);
        setEmailMsg("이미 존재하는 이메일입니다. 다른 이메일을 입력해주세요.");
      });
  }

  function postNickName(data) {
    axios
      .post(SERVER_URL + "/user-service/auth/nickname", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setNickNameVaild(true);
        setNickNameMsg("사용 가능한 닉네임입니다.");
      })
      .catch((err) => {
        console.log(err.request);
        setNickNameVaild(false);
        setNickNameMsg("이미 존재하는 닉네임입니다. 다른 닉네임을 입력해주세요.");
      });
  }

  const onEmailInputHandler = (e) => {
    const regex = /^[\w.%+\-]+@[\w.\-]+\.[A-Za-z]{2,3}$/; // 이메일 정규식
    if (regex.test(e.target.value)) {
      setEmailInput(e.target.value);
    } else {
      setEmailInput("");
    }
  };

  const onNameInputHandler = (e) => {
    setNameInput(e.target.value);
  };

  const onNickNameInputHandler = (e) => {
    setNickNameInput(e.target.value);
  };

  const onEmailCheckHandler = async (e) => {
    if (emailInput == "") {
      setEmailMsg("올바르지 않은 이메일 형식입니다. 다시 입력해주세요.");
      setEmailVaild(false);
    } else {
      await postEmail({ email: emailInput });
    }
  };

  const onEmailNumberCheckHandler = (e) => {
    if (certi == "") {
      setEmailCheckValid(false);
      setEmailCheckMsg("아직 인증 번호를 받지 않았습니다.");
      return;
    }
    if (certi == emailCheckInput_left + "-" + emailCheckInput_right) {
      setEmailCheckValid(true);
      setEmailCheckMsg("올바른 인증번호입니다.");
    } else {
      setEmailCheckValid(false);
      setEmailCheckMsg("올바르지 않은 인증번호입니다.");
    }
  };

  const onNickNameCheckHandler = (e) => {
    if (nickNameInput == "") {
      setNickNameMsg("닉네임을 입력해주세요.");
    } else {
      postNickName({ nickname: nickNameInput });
    }
  };

  const onPasswordInputHandler = (e) => {
    setPwdInput(e.target.value);
    if (e.target.value.length > 16) {
      setPwdMsg("비밀번호가 너무 깁니다. 16글자 이하로 입력해주세요.");
      setPwdVaild(false);
    } else if (e.target.value.length < 8) {
      setPwdMsg("비밀번호가 너무 짧습니다. 8글자 이상으로 입력해주세요.");
      setPwdVaild(false);
    } else {
      const regex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
      if (regex.test(e.target.value)) {
        // 숫자, 알파벳 조건 만족시
        setPwdMsg("");
        setPwdVaild(true);
      } else {
        // 둘 중 하나 없을 시
        setPwdMsg("숫자와 알파벳을 조합한 비밀번호를 입력해주세요.");
        setPwdVaild(false);
      }
    }
  };

  const onPasswordCheckHandler = (e) => {
    setPwdCheckInput(e.target.value);
    if (e.target.value === pwdInput) {
      setPwdCheckMsg("");
      setPwdCheckVaild(true);
    } else {
      setPwdCheckMsg("비밀번호가 다릅니다. 다시 한 번 확인해주세요.");
      setPwdCheckVaild(false);
    }
  };
  const onEmailCheckInputHandler_left = (e) => {
    const regex = /^[0-9\b -]{0,4}$/;
    if (regex.test(e.target.value)) {
      setEmailCheckInput_left(e.target.value);
    }
  };

  const onEmailCheckInputHandler_right = (e) => {
    const regex = /^[0-9\b -]{0,4}$/;
    if (regex.test(e.target.value)) {
      setEmailCheckInput_right(e.target.value);
    }
  };

  const onRegisterButtonHandler = (t) => {
    let valid = false;
    valid = emailVaild && emailCheckValid && nickNameVaild && pwdVaild && pwdCheckVaild;
    if (valid == true) {
      postRegister(t);
    } else {
      alert("회원가입에 실패했습니다. 입력하신 정보를 다시 한 번 확인해주세요.");
    }
  };

  useEffect(() => {
    if (pwdCheckInput === pwdInput) {
      setPwdCheckMsg("");
      setPwdCheckVaild(true);
    } else if (pwdCheckInput != "") {
      setPwdCheckMsg("비밀번호가 다릅니다. 다시 한 번 확인해주세요.");
      setPwdCheckVaild(false);
    }
  }, [pwdInput]);

  return (
    <div class="w-full font-test">
      <div className="Header" class="">
        <div class="mt-10 text-center">
          <h1 class="text-black font-rumpi text-6xl">Propofol</h1>
          <p class="text-2xl opacity-90 font-ltest text-gray-500">
            ( <a class="font-sbtest text-black">Pro</a>file + <a class="font-sbtest text-black">Po</a>rt
            <a class="font-sbtest text-black">fol</a>io )
          </p>
        </div>
      </div>
      <div className="Login" class="flex flex-col gap-6 mt-16">
        <div>
          <div class="flex gap-2 relative inset-x-1/2 transform -translate-x-1/2 w-1/5 min-w-[20rem]">
            <input
              class=" py-2 px-3 border rounded-lg bg-gray-50 w-7/10 focus:outline-0 text-lg font-ltest"
              placeholder="이메일"
              type="text"
              onChange={onEmailInputHandler}
            />
            <button class="rounded-lg bg-gray-500 text-white flex-grow" onClick={onEmailCheckHandler}>
              인증하기
            </button>
          </div>
          {emailMsg == "사용 가능한 이메일입니다." ? (
            <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 text-green-600 font-ltest mt-1 min-w-[20rem]">
              {emailMsg}
            </div>
          ) : (
            <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 text-red-500 font-ltest mt-1 min-w-[20rem]">
              {emailMsg}
            </div>
          )}
        </div>
        <div>
          <div class="flex items-center gap-2 relative inset-x-1/2 transform -translate-x-1/2 w-1/5 min-w-[20rem]">
            <input
              class=" py-2 px-3 border rounded-lg bg-gray-50 w-[32.5%] focus:outline-0 text-lg font-ltest"
              placeholder="인증번호"
              type="text"
              onChange={onEmailCheckInputHandler_left}
              value={emailCheckInput_left}
            />
            -
            <input
              class=" py-2 px-3 border rounded-lg bg-gray-50 w-[32.5%] focus:outline-0 text-lg font-ltest"
              placeholder="인증번호"
              type="text"
              onChange={onEmailCheckInputHandler_right}
              value={emailCheckInput_right}
            />
            <button
              class="h-full py-[10px] rounded-lg bg-gray-500 text-white flex-grow"
              onClick={onEmailNumberCheckHandler}
            >
              확인
            </button>
          </div>
          {emailCheckMsg == "올바른 인증번호입니다." ? (
            <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 text-green-600 font-ltest mt-1 min-w-[20rem]">
              {emailCheckMsg}
            </div>
          ) : (
            <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 text-red-500 font-ltest mt-1 min-w-[20rem]">
              {emailCheckMsg}
            </div>
          )}
        </div>
        <div>
          <div class="flex gap-2 relative inset-x-1/2 transform -translate-x-1/2 w-1/5 min-w-[20rem]">
            <input
              class=" py-2 px-3 border rounded-lg bg-gray-50 w-7/10 focus:outline-0 text-lg font-ltest"
              placeholder="닉네임"
              type="text"
              onChange={onNickNameInputHandler}
            />
            <button class="rounded-lg bg-gray-500 text-white flex-grow" onClick={onNickNameCheckHandler}>
              중복 확인
            </button>
          </div>
          {nickNameMsg == "사용 가능한 닉네임입니다." ? (
            <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 text-green-600 font-ltest mt-1 min-w-[20rem]">
              {nickNameMsg}
            </div>
          ) : (
            <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 text-red-500 font-ltest mt-1 min-w-[20rem]">
              {nickNameMsg}
            </div>
          )}
        </div>
        <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 min-w-[20rem]">
          <input
            class="w-full py-2 px-3 border rounded-lg bg-gray-50 focus:outline-0 text-lg font-ltest"
            placeholder="이름"
            type="text"
            onChange={onNameInputHandler}
          />
        </div>

        <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 min-w-[20rem]">
          <input
            class="w-full py-2 px-3 border rounded-lg bg-gray-50 focus:outline-0 text-lg font-ltest"
            placeholder="비밀번호"
            type="password"
            onChange={onPasswordInputHandler}
          />
          <div class="text-red-500 font-ltest mt-1">{pwdMsg}</div>
        </div>
        <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 min-w-[20rem]">
          <input
            class="w-full py-2 px-3 border rounded-lg bg-gray-50 focus:outline-0 text-lg font-ltest"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onPasswordCheckHandler}
          />
          <div class="text-red-500 font-ltest mt-1">{pwdCheckMsg}</div>
        </div>
        <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 flex items-center justify-center gap-3 mt-2">
          <input
            type="checkbox"
            class="rounded-sm appearance-none w-5 h-5 border border-gray-300 checked:border-transparent checked:back
        form-tick min-w-[1em] min-h-[1em]
        "
          />
          <div class="text-center text-gray-400 2xl:text-baselg font-ltest min-w-[18em] xl:text-base">
            이용약관 및 개인정보 처리방침에 동의합니다.
          </div>
        </div>
        <button
          class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 rounded-lg bg-black text-white py-3 mt-3 text-2xl font-sbtest min-w-[20rem]"
          onClick={() => {
            const t = {
              email: emailInput,
              password: pwdInput,
              username: nameInput,
              nickname: nickNameInput,
            };
            onRegisterButtonHandler(t);
          }}
        >
          계정 만들기
        </button>
        <div class="relative inset-x-1/2 transform -translate-x-1/2 w-1/5 mt-1 mb-5 border-t pt-5 border-gray-400 flex justify-center gap-2 text-gray-500 font-ltest text-center min-w-[20rem]">
          <div>이미 계정이 있다면? </div>
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인{">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
