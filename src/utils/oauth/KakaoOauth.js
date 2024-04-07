import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../SRC";

function KakaoOauth(props) {
  const pathname = useLocation().search;
  const code = pathname.substring(6, pathname.length);
  useEffect(() => {
    axios
      .get(SERVER_URL + "/oauth2/kakao/login?code=" + code)
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="loading-container">
      <div className="loading"></div>
      <div id="loading-text">loading</div>
    </div>
  );
}

export default KakaoOauth;
