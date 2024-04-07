import { React, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { SERVER_URL } from "../../utils/SRC";
import { TagModal, TeamScheduleModal } from "../../Component/Modal";
import "react-datepicker/dist/react-datepicker.css";
import ProjectEditor from "../../Component/Project/ProjectEditor";
import axios from "axios";

function ProjectWriting() {
  const [isModify, setIsModify] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const writingNo = searchParams.get("No");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [recruit, setRecruit] = useState("");

  const [showTagMoadl, setShowTagModal] = useState(false);
  const [selectedTagList, setSelectedTagList] = useState([]);

  const [project, setProject] = useState({});
  const [showTeamScheduleModal, setShowTeamScheduleModal] = useState(false);
  const [teamScheduleList, setTeamScheduleList] = useState([]);

  const [errmsg, setErrmsg] = useState("");

  const Swal = require("sweetalert2");

  function dateToString(prevdate) {
    let year, month, date;
    year = prevdate.getFullYear();
    if (prevdate.getMonth() < 10) {
      month = "0" + (prevdate.getMonth() + 1);
    } else {
      month = prevdate.getMonth();
    }
    if (prevdate.getDate() < 10) {
      date = "0" + prevdate.getDate();
    } else {
      date = prevdate.getDate();
    }
    return year + "-" + month + "-" + date;
  }

  async function loadImage(tmpInfo) {
    let tmpimgsrc = [];
    let tmpimgsrctype = [];
    let tmploadbyte = [];
    let start = 0;
    let end = 0;
    let k = 0;
    while (tmpInfo.content.indexOf('<img src="http://', end) != -1) {
      start = tmpInfo.content.indexOf('<img src="http://');
      end = tmpInfo.content.indexOf(">", start);
      tmpimgsrc.push(tmpInfo.content.slice(start + 10, end - 1));
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
          console.log(err.response);
        });
    }

    for (let i = 0; i < tmpimgsrc.length; i++) {
      tmpInfo.content = tmpInfo.content.replace(tmpimgsrc[i], tmploadbyte[i]);
    }
    await setProject(tmpInfo);
    setTitle(tmpInfo.title);
    setSelectedTagList(tmpInfo.tagInfos);
    setStartDate(new Date(tmpInfo.startDate));
    setEndDate(new Date(tmpInfo.endDate));
    setRecruit(tmpInfo.recruit);
    setContent(tmpInfo.content);
    await setLoadingComplete(true);
  }

  function findImage(isUpdated, imgByteList, imgByteTypeList) {
    //content 내부의 image를 string 검색으로 찾아냄.
    //해당 이미지들을 imgByteList에 push하고, 해당 이미지의 type들도 imgByteTypeList에 push함.
    // --> imgByteList , imgByteTypeList
    let start = 0;
    let end = 0;
    let k = 0;
    let tmpContent;
    //
    tmpContent = content;

    if (isUpdated || !isModify) {
      //만약 업데이트가 되었거나, props.isModify가 거짓일 경우(글 수정이 아니라 작성 중일 경우)
      tmpContent = content; //tmpContent에 content 넣어줌.
    } else {
      // 글 수정중이고, 업데이트도 되지 않았을 경우
      tmpContent = content; //props.loadWritingInfo에서 받아온 기존 글의 detail을 넣어줌.
    }

    while (tmpContent.indexOf('<img src="data:image/', end) != -1) {
      start = tmpContent.indexOf('<img src="data:image/', end);
      end = tmpContent.indexOf(">", start);
      imgByteList.push(tmpContent.slice(start + 10, end - 1));
      imgByteTypeList.push(imgByteList[k].slice(11, imgByteList[k].indexOf(";", 11)));
      k++;
    }
  }

  function makeImageFileStruct(imgByteList, imgByteTypeList, formData_Image) {
    //파일 구조체 만듦
    //findImage 이후에 호출함. findImage에서 이미지 base64값을 넣은 imgByteList의 값들을 통해 File 객체를 만듦.
    //해당 File 객체들은 formData_Image에 append됨. --> 이후 backend에 axios를 통해 전달.
    let fileName = [];
    for (let i = 0; i < imgByteList.length; i++) {
      fileName.push(Math.random().toString(36).substring(2, 11));
    }
    for (let i = 0; i < imgByteList.length; i++) {
      let imgB = imgByteList[i].replace("data:image/" + imgByteTypeList[i] + ";base64,", "");
      let bstr = atob(imgB);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let file = new File([u8arr], fileName[i] + "." + imgByteTypeList[i], {
        type: "image/" + imgByteTypeList[i],
        lastModified: new Date(),
      });
      formData_Image.append("file", file);
    }
  }

  async function modifyHandler() {
    // saveHandler와 동일하게 정보를 보냄.
    // 기존 내용에서 수정되지 않았을 경우를 if문으로 처리해줌.
    // 이미지를 보낼 때 boardId도 함께 보내줌.
    const formData_Save = new FormData();
    const formData_Image = new FormData();
    let imgByteList = [];
    let imgByteTypeList = [];
    let tmpTagIdList = [];
    if (content == "") {
      // content에 변화가 없어 setState로 관리되는 htmlContent가 비어있을 때
      await findImage(false, imgByteList, imgByteTypeList); // findImage에 내용 변화가 없었음을 전달
    } else {
      // 내용 변화가 있었을 경우
      await findImage(true, imgByteList, imgByteTypeList); // findImage에 내용 변화가 있었음을 전달
    }
    await makeImageFileStruct(imgByteList, imgByteTypeList, formData_Image);
    if (title == "") {
      formData_Save.append("title", project.title);
    } // 제목에 변화가 없었을 시 기존 제목 formData_Save에 넣어줌.
    else {
      formData_Save.append("title", title);
    }
    //
    if (startDate == null) {
      formData_Save.append("startDate", project.startDate);
    } else {
      formData_Save.append("startDate", dateToString(startDate));
    }
    if (endDate == null) {
      formData_Save.append("startDate", project.startDate);
    } else {
      formData_Save.append("endDate", dateToString(endDate));
    }
    if (recruit == "") {
      formData_Save.append("recruit", project.recruit);
    } else {
      formData_Save.append("recruit", recruit);
    }

    selectedTagList.map((item) => {
      tmpTagIdList.push(item.id);
    });
    formData_Save.append("tagId", tmpTagIdList);

    //
    if (imgByteList.length != 0) {
      let htmlContent_after;
      formData_Image.append("boardId", project.id * 1);
      await axios
        .post(SERVER_URL + "/matching-service/api/v1/images", formData_Image)
        .then((res) => {
          let tmpUrlList = [];
          let tmpNameList = [];
          res.data.data.map((result) => {
            let IMG_URL = result.toString().replace("http://localhost:8000", SERVER_URL);
            let imageName = result.toString().replace("http://localhost:8000/matching-service/api/v1/images/", "");
            tmpUrlList.push(IMG_URL);
            tmpNameList.push(imageName);
          });
          tmpNameList.map((fileName) => {
            formData_Save.append("fileName", fileName);
          });

          if (content == "") {
            // 내용 수정이 없었을 시, props.loadWritingInfo.detail에서 image src 교체
            htmlContent_after = content;
          } else {
            htmlContent_after = content;
          }
          for (let i = 0; i < tmpUrlList.length; i++) {
            htmlContent_after = htmlContent_after.toString().replace(imgByteList[i], tmpUrlList[i]);
          }
          formData_Save.append("content", htmlContent_after);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
        });
    } else {
      //이미지가 없을 시
      if (content == "") {
        // 내용 변화가 없었으므로 기존 내용을 formData_save에 'content' 키값으로 저장
        formData_Save.append("content", content);
      } else {
        //, 기존 htmlContent를 그대로 formData_save에 'content' 키값으로 저장
        formData_Save.append("content", content);
      }
    }
    await axios
      .post(SERVER_URL + "/matching-service/api/v1/matchings/" + project.id, formData_Save)
      .then((res) => {})
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        }
      });
  }

  async function saveHandler() {
    const formData_Save = new FormData();
    const formData_Image = new FormData();
    let err = -1;
    let tmpTagIdList = [];
    selectedTagList.map((item) => {
      tmpTagIdList.push(item.id);
    });

    if (title == "") {
      setErrmsg("제목을 입력해주세요.");
    } else if (content == "") {
      setErrmsg("내용을 입력해주세요.");
    } else if (startDate == null) {
      setErrmsg("시작 날짜를 선택해주세요.");
    } else if (endDate == null) {
      setErrmsg("종료 날짜를 선택해주세요.");
    } else if (recruit == "") {
      setErrmsg("모집 인원을 입력해주세요.");
    } else if (selectedTagList.length == 0) {
      setErrmsg("태그를 선택해주세요.");
    } else if (teamScheduleList.length == 0) {
      setErrmsg("팀 시간표를 생성해주세요.");
    } else {
      err = 0;
    }
    if (err == -1) {
      Swal.fire({
        text: errmsg,
        confirmButtonText: "",
        confirmButtonColor: "#171717",
        timer: 650,
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: false,
      });
      return;
    }
    //
    let imgByteList = [];
    let imgByteTypeList = [];
    await findImage(true, imgByteList, imgByteTypeList);
    await makeImageFileStruct(imgByteList, imgByteTypeList, formData_Image);
    //
    if (formData_Image.getAll("file").length != 0) {
      await axios
        .post(SERVER_URL + "/matching-service/api/v1/images", formData_Image)
        .then((res) => {
          let content_after = content;
          let tmpUrlList = [];
          let tmpNameList = [];
          res.data.data.map((result) => {
            let IMG_URL = result.toString().replace("http://localhost:8000", SERVER_URL);
            let imageName = result.toString().replace("http://localhost:8000/matching-service/api/v1/images/", "");
            tmpUrlList.push(IMG_URL);
            tmpNameList.push(imageName);
          });
          tmpNameList.map((fileName) => {
            //formData_Save에 파일 이름(백에 저장된 이름) 저장
            formData_Save.append("fileName", fileName);
          });
          for (let i = 0; i < tmpUrlList.length; i++) {
            content_after = content_after.toString().replace(imgByteList[i], tmpUrlList[i]);
          }
          formData_Save.append("content", content_after);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      formData_Save.append("content", content);
    }
    formData_Save.append("title", title);
    formData_Save.append("startDate", dateToString(startDate));
    formData_Save.append("endDate", dateToString(endDate));
    formData_Save.append("recruit", recruit);
    formData_Save.append("tagId", tmpTagIdList);
    teamScheduleList.map((item) => {
      formData_Save.append("startTime", item.startTime);
      formData_Save.append("endTime", item.endTime);
      formData_Save.append("week", item.week);
    });

    await axios
      .post(SERVER_URL + "/matching-service/api/v1/matchings", formData_Save)
      .then((res) => {
        navigate("/pm/main");
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  const keyPressHandler = (e) => {
    let keyword = e.currentTarget.value;
    let taglist = "";
    selectedTagList.map((item) => {
      taglist = taglist + "+" + item.id;
    });
    if (e.key === "Enter") {
      navigate("/pm/search?keyword=" + keyword + "&tag=" + taglist);
    }
  };

  const onFileButtonHandler = (e) => {
    const myInput = document.getElementById("input-file");
    myInput.click();
  };

  function loadProjectDetail() {
    let tmpInfo;
    axios
      .get(SERVER_URL + "/matching-service/api/v1/matchings/" + writingNo)
      .then((res) => {
        tmpInfo = res.data.data;
        loadImage(tmpInfo);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  useEffect(() => {
    if (writingNo != null) {
      setIsModify(true);
      loadProjectDetail();
    }
  }, []);

  return (
    <div class="bg-white w-full font-test">
      {showTagMoadl ? (
        <TagModal
          setShowTagModal={setShowTagModal}
          selectedTagList={selectedTagList}
          setSelectedTagList={setSelectedTagList}
        />
      ) : null}
      {showTeamScheduleModal ? (
        <TeamScheduleModal
          setShowTeamScheduleModal={setShowTeamScheduleModal}
          setTeamScheduleList={setTeamScheduleList}
        />
      ) : null}
      <div class="relative w-[60rem] inset-x-1/2 transform -translate-x-1/2">
        <div class="relative my-10">
          <div class="mt-4 text-3xl font-btest">{isModify ? "프로젝트 수정하기" : "새 프로젝트 생성하기"}</div>
          <div class="mt-4">
            <input
              class="w-full py-2 px-3 border bg-gray-50 focus:outline-0 text-lg font-ltest"
              placeholder="제목"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div class="flex flex-wrap items-center gap-5 mt-4">
            <div class="text-lg text-gray-600 font-ltest w-fit">#태그</div>
            {selectedTagList.map((item) => {
              return (
                <div class="w-1/6 py-2 px-3 border border-indigo-300 text-indigo-400 text-center bg-indigo-50 text-md font-test min-w-[6rem]">
                  {item.name}
                </div>
              );
            })}
            <button
              class="text-center w-1/6 py-2 px-3 border border-gray-300 bg-gray-50 focus:outline-0 text-md font-test min-w-[6rem]"
              onClick={() => {
                setShowTagModal(true);
              }}
            >
              +
            </button>
          </div>
          <div class="flex gap-2">
            <div class="mt-4 w-1/3 border border-gray-300">
              <DatePicker
                selected={startDate}
                dateFormat="yyyy-MM-dd"
                onChange={(date) => setStartDate(date)}
                shouldCloseOnSelect={false}
                placeholderText="시작 날짜"
              />
            </div>
            <div class="mt-4 w-1/3 border border-gray-300">
              <DatePicker
                selected={endDate}
                dateFormat="yyyy-MM-dd"
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
                shouldCloseOnSelect={false}
                placeholderText="종료 날짜"
              />
            </div>
            <div class="mt-4 w-1/3 py-2 px-2 border border-gray-300">
              <input
                class="focus:outline-0"
                placeholder="모집 인원"
                value={recruit}
                onChange={(e) => setRecruit(e.currentTarget.value)}
              />
            </div>
          </div>
          <div class="mt-4 flex text-lg text-gray-600 font-ltest justify-start gap-10">
            {isModify ? null : teamScheduleList.length == 0 ? (
              <button
                class=""
                onClick={() => {
                  setShowTeamScheduleModal(true);
                }}
              >
                팀 시간표 생성{">"}
              </button>
            ) : (
              <button
                class=""
                onClick={() => {
                  setShowTeamScheduleModal(true);
                }}
              >
                팀 시간표 조회{">"}
              </button>
            )}
          </div>
          {isModify ? (
            loadingComplete ? (
              <>
                <div class="w-full mt-6 min-h-[60rem] border border-gray-300 bg-white text-lg font-ltest min-w-[20rem] ">
                  <ProjectEditor setContent={setContent} isModify={isModify} content={content} />
                </div>
                <div class="mt-4 flex justify-end">
                  <button
                    class="bg-gray-600 text-white border rounded-lg px-4 py-2"
                    onClick={() => {
                      modifyHandler();
                    }}
                  >
                    수정하기
                  </button>
                </div>
              </>
            ) : (
              <div>로딩중...</div>
            )
          ) : (
            <>
              <div class="w-full mt-6 min-h-[60rem] border border-gray-300 bg-white text-lg font-ltest min-w-[20rem] ">
                <ProjectEditor content={content} setContent={setContent} isModify={isModify} />
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  class="bg-gray-600 text-white border rounded-lg px-4 py-2"
                  onClick={() => {
                    saveHandler();
                  }}
                >
                  등록하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectWriting;
