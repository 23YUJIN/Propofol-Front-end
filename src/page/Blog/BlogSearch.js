import axios from "axios";
import { React, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SERVER_URL } from "../../utils/SRC";
import BlogSearchBar from "../../Component/Blog/BlogSearchBar";
import { TagModal } from "../../Component/Modal";
import { Page } from "../../utils/page";
import { BlogWritingList } from "../../Component/Blog/BlogWritingList";
import { htmlDetailToText } from "../../utils/html";

function BlogSearch() {
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState([]);
  const [searchParams, setSeratchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const option = searchParams.get("option");
  const tag = searchParams.get("tag");
  //
  const [showTagMoadl, setShowTagModal] = useState(false);
  const [selectedTagList, setSelectedTagList] = useState([]);
  //
  const [totalPage, setTotalPage] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [selected, setSelected] = useState(1);
  //
  const [writingTextList, setWritingTextList] = useState([]);
  function pageHandler() {
    navigate("");
  }
  //
  async function loadSearchResult(page) {
    //
    let taglist = tag.split(" ").slice(1);
    let tmptaglist = [];
    let tagIdlist = [];
    taglist.map((item) => {
      tmptaglist.push({ name: item.split("_")[1], id: item.split("_")[0] });
      tagIdlist.push(item.split("_")[0]);
    });
    setSelectedTagList([...tmptaglist]);
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    params.append("page", page);
    tagIdlist.map((item) => {
      params.append("tagId", item);
    });
    //
    if (option == "제목") {
      await axios
        .get(SERVER_URL + "/til-service/api/v1/boards/search", {
          params: params,
        })
        .then((res) => {
          let pageCount = res.data.data.totalPageCount;
          let tmpTextList = [];
          let tempSRList = [];
          res.data.data.boards.map((board) => {
            let tempSR;
            let tmpImgType = null;
            if (board.imgtype != null) {
              tmpImgType = board.imageType.toString().split("/")[1];
            }
            tempSR = {
              id: board.id,
              title: board.title,
              detail: board.content,
              date: board.createdDate,
              nickname: board.nickname,
              open: board.open,
              img: board.imageBytes,
              imgtype: tmpImgType,
              like: board.recommend,
              comment: board.commentCount,
              tag: board.tagInfos,
            };
            tempSR.date = tempSR.date.substring(0, 10) + "   " + tempSR.date.substring(11, 16);
            tmpTextList.push(htmlDetailToText(board.content));
            tempSRList.push(tempSR);
          });
          setTotalPage(pageCount);
          setSearchResult([...tempSRList]);
          setWritingTextList([...tmpTextList]);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }

  useEffect(() => {
    loadSearchResult(1);
  }, []);

  return (
    <div class="bg-white w-full h-screen font-test">
      {showTagMoadl ? (
        <TagModal
          setShowTagModal={setShowTagModal}
          selectedTagList={selectedTagList}
          setSelectedTagList={setSelectedTagList}
        />
      ) : null}
      <div class="relative w-[60rem] inset-x-1/2 transform -translate-x-1/2 ">
        <div class="mt-10">
          <BlogSearchBar setShowTagModal={setShowTagModal} selectedTagList={selectedTagList} keyword={keyword} />
        </div>
        <div class="mt-10 border rounded-lg">
          <BlogWritingList
            writingList={searchResult}
            onWritingClickHandler={(e) => {
              navigate("/blog/detail/" + e.currentTarget.value);
            }}
            writingTextList={writingTextList}
          />
        </div>
        <div class="flex justify-center mt-5 gap-2 font-ltest">
          <Page
            startPage={startPage}
            totalPage={totalPage}
            setSelected={setSelected}
            load={pageHandler}
            selected={selected}
          />
        </div>
      </div>
    </div>
  );
}

export default BlogSearch;
