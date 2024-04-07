import { React, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SERVER_URL } from "../../utils/SRC";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import BlogEditor from "../../Component/Blog/BlogEditor";

function BlogWr2() {
  let isModify = false;
  let wrInfo;
  const [searchParams, setSearchParams] = useSearchParams();
  const [writingInfo, setWritingInfo] = useState({});
  const [loadingComplete, setLoadingComplete] = useState(false);
  const writingNo = searchParams.get("No");

  async function loadImage(tmpInfo) {
    let tmpimgsrc = [];
    let tmpimgsrctype = [];
    let tmploadbyte = [];
    let start = 0;
    let end = 0;
    let k = 0;
    while (tmpInfo.detail.indexOf('<img src="http://', end) != -1) {
      start = tmpInfo.detail.indexOf('<img src="http://');
      end = tmpInfo.detail.indexOf(">", start);
      tmpimgsrc.push(tmpInfo.detail.slice(start + 10, end - 1));
      tmpimgsrctype.push(tmpimgsrc[k].slice(-3));
      k++;
    }
    for (let i = 0; i < tmpimgsrc.length; i++) {
      await axios
        .get(tmpimgsrc[i])
        .then((res) => {
          tmploadbyte.push("data:image/" + tmpimgsrctype[i] + ";base64," + res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    for (let i = 0; i < tmpimgsrc.length; i++) {
      tmpInfo.detail = tmpInfo.detail.replace(tmpimgsrc[i], tmploadbyte[i]);
    }
    await setWritingInfo(tmpInfo);
    await setLoadingComplete(true);
  }

  async function loadWritings() {
    let tmpInfo;
    await axios
      .get(SERVER_URL + "/til-service/api/v1/boards/" + writingNo)
      .then((res) => {
        let byteList = [],
          typeList = [];
        const writing = res.data.data;
        if (writing.images != null) {
          writing.images.map((imgbyte) => {
            byteList.push(imgbyte);
          });
          writing.imageTypes.map((imgtype) => {
            typeList.push(imgtype.toString().split("/")[1]);
          });
        }
        tmpInfo = {
          title: writing.title,
          detail: writing.content,
          date: writing.createdDate,
          open: writing.open,
          img: byteList,
          imgtype: typeList,
          like: writing.recommend,
          commentCount: writing.commentCount,
          tag: writing.tagInfos,
        };
        loadImage(tmpInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (writingNo != null) {
      isModify = true;
      if (isModify) {
        //글 정보 불러오기. 불러온 글 정보는 wrInfo에 저장됨.
        loadWritings();
      }
    }
  }, []);

  if (writingNo != null) {
    return (
      <div class="bg-white w-full  min-h-[80rem] ">
        {loadingComplete ? (
          <div class="bg-white w-full h-screen font-test">
            <BlogEditor isModify={true} loadWritingInfo={writingInfo} boardId={writingNo} />
          </div>
        ) : (
          <div>로딩중...</div>
        )}
      </div>
    );
  } else {
    return (
      <div class="bg-white w-full min-h-[80rem] font-test">
        <BlogEditor isModify={false} loadWritingInfo={wrInfo} />
      </div>
    );
  }
}

export default BlogWr2;
