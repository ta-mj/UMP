import React, { useCallback, useEffect, useRef, useState } from "react";
import Compose from "../Compose/Compose";
import Toolbar from "../Toolbar/Toolbar";
import ToolbarButton from "../ToolbarButton/ToolbarButton";
import Message from "../Message/Message";
import moment from "moment";

import "./MessageList.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactModal from "react-modal";
import Review from "../Review/Review";
import { Button, Checkbox, Form } from "antd";
import axios from "axios";
import FriendList from "../FriendList/FriendList";
import { DatePicker, Space, TimePicker, Input, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

//채팅방 구현
export default function MessageList({ props }) {
  const MY_USER_ID = props.id;
  const MY_NAME = props.name;

  const scrollRef = useRef();

  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const state = location.state;

  const [result, setResult] = useState([]);
  const [text, setText] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reviewIsOpen, setReviewIsOpen] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);

  const [roomPeople, setRoomPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFriendName, setSelectedFriendName] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleAppoint, setAppoint] = useState(false);

  const onChange = (time, timeString) => {
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      time: timeString,
    }));
  };

  const onOk = (time) => {
    console.log(time);
  };
  const [appointment, setAppointment] = useState({
    time: "",
    location: "",
    roomName: "",
  });

  const webSocketUrl = "ws://localhost:8080/websocket?roomId=" + id;
  const ws = useRef(null);

  useEffect(() => {
    localStorage.setItem("location", "room");
    if (!ws.current) {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
        setSocketConnected(true);
      };
      ws.current.onclose = (error) => {
        console.log("disconnect from " + webSocketUrl);
        console.log(error);
        // alert(`에러발생!`);
        // window.location.reload();
      };
      ws.current.onerror = (error) => {
        console.log("connection error " + webSocketUrl);
        console.log(error);
      };
      ws.current.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        const tempMsg = {
          author: data.senderId,
          message: data.textMsg,
          timestamp: data.sendTime,
          name: data.sendName,
        };
        setMessages((prevMessages) => [...prevMessages, tempMsg]);
      };

      getMessages();

      getFriends();
      if (state.isAppoint) {
        const currentDate = new Date();
        const appointmentDate = new Date(state.time);

        if (currentDate > appointmentDate) {
          console.log("약속 시간이 이미 지났습니다.");
          getPreRoomPeople();
          setReviewIsOpen(true);
        } else {
          console.log("약속 시간이 아직 남았습니다.");
          getRoomPeople();
        }
      }
    }
    scrollToBottom();
    window.addEventListener("load", scrollToBottom); // 페이지 로드될 때 스크롤 이벤트 처리

    return () => {
      console.log("clean up");
      // localStorage.setItem("location", "notRoom");
      window.removeEventListener("load", scrollToBottom); // 컴포넌트 언마운트 시 이벤트 리스너 제거

      ws.current.close();
    };
  }, []);

  useEffect(() => {
    makeMsg();
    if (socketConnected && text) {
      ws.current.send(
        JSON.stringify({
          roomId: id,
          textMsg: text.message,
          sendTime: new Date().getTime(),
          senderId: MY_USER_ID,
          sendName: MY_NAME,
        })
      );
    }
  }, [text]);

  useEffect(() => {
    renderMessages();
    scrollToBottom();
  }, [messages]);

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const getPreRoomPeople = () => {
    axios({
      method: "get",
      url: "/appointment-room/members",
      headers: {
        "Content-Type": `application/json`,
      },
      params: { roomId: id },
      withCredentials: true,
    })
      .then((response) => {
        const newPeople = response.data.map((value) => {
          return value;
        });
        setRoomPeople(newPeople);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const getRoomPeople = () => {
    axios({
      method: "get",
      url: "/chattingroom/members",
      headers: {
        "Content-Type": `application/json`,
      },
      params: { roomId: id },
      withCredentials: true,
    })
      .then((response) => {
        const newPeople = response.data.map((value) => {
          return value;
        });
        setRoomPeople(newPeople);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      // scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      window.scrollBy({
        top: 9999999999999,
        behavior: "smooth", // 스크롤 애니메이션 적용 (optional)
      });
    }
  };

  const getText = (prop) => {
    setText(prop);
  };

  const makeMsg = () => {
    if (text) {
      setMessages([...messages, text]);
    }
  };

  const getMessages = () => {
    axios({
      method: "get",
      url: "/chattingroom/messages",
      headers: {
        "Content-Type": `application/json`,
      },
      params: { roomId: id },
      withCredentials: true,
    })
      .then((response) => {
        response.data.map((value) => {
          const tempMsg = {
            author: value.senderId,
            message: value.textMsg,
            timestamp: value.sendTime,
            name: value.sendName,
          };
          setMessages((prevMessages) => [...prevMessages, tempMsg]);
        });
      })
      .catch((error) => {
        console.log(error);
        // alert(error.response.data);
      });
  };

  const outRoom = () => {
    axios({
      method: "delete",
      url: "/chattingroom/member",
      headers: {
        "Content-Type": `application/json`,
      },
      params: { roomId: id },
      withCredentials: true,
    })
      .then((response) => {
        ws.current.send(
          JSON.stringify({
            roomId: id,
            textMsg: `※알림 ${MY_NAME}님이 나갔습니다.`,
            sendTime: new Date().getTime(),
            senderId: `server`,
            sendName: `server`,
          })
        );
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      const senderName = isMine ? MY_NAME : current.name;

      const isServer = current.name === `server`;

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          prevBySameAuthor={prevBySameAuthor}
          showTimestamp={showTimestamp}
          data={current}
          senderName={senderName} // Pass senderId as senderName prop
          isServer={isServer}
          // currentUser={currentUser}
        />
      );

      // Proceed to the next message.
      i += 1;
    }
    setResult(tempMessages);
  };

  const renderFriendsList = () => {
    return friends.length !== 0 ? (
      <div>
        {friends.map((friend, index) => (
          <div key={index}>
            <Checkbox
              onChange={(e) => handleSelectFriend(e, friend.id, friend.name)}
              checked={selectedFriends.includes(friend.id)}
            >
              {friend.name}
            </Checkbox>
          </div>
        ))}
        <Button onClick={addFriend}>초대</Button>
      </div>
    ) : (
      <div>초대할 사람이 없습니다</div>
    );
  };

  const renderAppointmentList = () => {
    return roomPeople.length !== 0 ? (
      <div>
        {roomPeople.map((friend, index) =>
          friend.id !== MY_USER_ID ? (
            <div key={index}>
              <Checkbox
                onChange={(e) => handleSelectFriend(e, friend.id, friend.name)}
                checked={selectedFriends.includes(friend.id)}
              >
                {friend.name}
              </Checkbox>
            </div>
          ) : (
            <></>
          )
        )}
        <Button onClick={addAppointment}>약속 확정</Button>
      </div>
    ) : (
      <div>초대할 사람이 없습니다</div>
    );
  };

  const addFriend = () => {
    const nowTime = new Date().getTime();
    axios({
      method: "post",
      url: "/chattingroom/member",
      headers: {
        "Content-Type": `application/json`,
      },
      data: {
        roomId: id,
        inviteeIds: selectedFriends,
        enterTime: nowTime,
      },
      withCredentials: true,
    })
      .then((response) => {
        console.log("초대 ID들", selectedFriends);
        console.log("addFriend response", response);
        let friendNames;
        if (selectedFriendName.length === 1) {
          friendNames = selectedFriendName[0]; // 선택된 친구가 한 명인 경우
        } else {
          friendNames = selectedFriendName.join(", "); // 선택된 친구 이름들을 쉼표로 구분하여 하나의 문자열로 변환
        }
        ws.current.send(
          JSON.stringify({
            roomId: id,
            textMsg: `※알림 ${friendNames}님이 들어왔습니다.`,
            sendTime: nowTime,
            senderId: `server`,
            sendName: `server`,
          })
        );
        const tempMsg = {
          author: `server`,
          message: `※알림 ${friendNames}님이 들어왔습니다.`,
          timestamp: nowTime,
          name: `server`,
        };
        setMessages((prevMessages) => [...prevMessages, tempMsg]);

        alert(`${friendNames}님을 초대했습니다`);
        setVisible(!visible);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  // 친구 목록을 가져오는 함수
  const getFriends = () => {
    axios({
      method: "get",
      url: "/friends",
      headers: {
        "Content-Type": `application/json`,
      },
      withCredentials: true,
    })
      .then((response) => {
        let newFriends = response.data.map((result) => {
          return { id: result.id, name: result.name };
        });
        const filteredFriends = newFriends.filter((friend) => {
          const friendIds = roomPeople.map((person) => person.id);
          return !friendIds.includes(friend.id);
        });

        setFriends(filteredFriends);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const handleShowFriends = () => {
    setSelectedFriends([]);
    setSelectedFriendName([]);
    getFriends();
    setVisible(!visible);
  };

  const handleSelectFriend = (e, selectedFriend, FriendName) => {
    if (e.target.checked) {
      setSelectedFriends([...selectedFriends, selectedFriend]);
      setSelectedFriendName([...selectedFriendName, FriendName]);
    } else {
      setSelectedFriends(
        selectedFriends.filter((friendName) => friendName !== selectedFriend)
      );
      setSelectedFriendName(
        selectedFriendName.filter((friendName) => friendName !== FriendName)
      );
    }
  };

  const addAppointment = () => {
    axios({
      method: "post",
      url: "/appointment-room",
      headers: {
        "Content-Type": `application/json`,
      },
      data: {
        userIds: selectedFriends,
        roomName: appointment.roomName,
        createTime: new Date().getTime(),
        time: appointment.time,
        location: appointment.location,
      },
      withCredentials: true,
    })
      .then((response) => {
        let friendNames;
        if (selectedFriendName.length === 1) {
          friendNames = selectedFriendName[0]; // 선택된 친구가 한 명인 경우
        } else {
          friendNames = selectedFriendName.join("님, "); // 선택된 친구 이름들을 쉼표로 구분하여 하나의 문자열로 변환
        }
        alert(
          `${friendNames}님과 ${appointment.time}에 약속을 잡았습니다. \n채팅방 목록에서 약속채팅방을 확인하실 수 있습니다.`
        );
        setAppoint(!visibleAppoint);
        setModalIsOpen(false);
        setAppointment({
          time: "",
          location: "",
          roomName: "",
        });
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const handleAppointment = () => {
    getRoomPeople();
    setSelectedFriends([]);
    setSelectedFriendName([]);
    setAppoint(!visibleAppoint);
  };

  return (
    <div className="message-list" ref={scrollRef}>
      <Toolbar
        title={state.name}
        rightItems={[
          <div
            onClick={() => {
              getRoomPeople();
              setModalIsOpen(true);
            }}
          >
            <ToolbarButton key="menu" icon="ion-ios-menu" />
          </div>,
        ]}
      />

      <div className="message-list-container" ref={scrollRef}>
        {result}

        <Compose getText={getText} MY_USER_ID={MY_USER_ID} MY_NAME={MY_NAME} />
      </div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={`modal ${modalIsOpen ? "open" : ""}`}
        overlayClassName={`overlay ${modalIsOpen ? "open" : ""}`}
      >
        <Toolbar
          title={"메뉴"}
          rightItems={[
            <div
              onClick={() => {
                if (window.confirm(`이 채팅방을 나가시겠습니까?`)) {
                  setModalIsOpen(false);
                  outRoom();
                  // setReviewIsOpen(true);
                }
              }}
            >
              <ToolbarButton key="exit" icon="ion-ios-exit" />
            </div>,
          ]}
        />

        <div
          className="modal-content"
          style={{ maxHeight: "800px", overflowY: "auto" }}
        >
          <div className="room-info">
            <div>채팅방 정보: {state.name}</div>
            <div className="room-people">
              {roomPeople.map((friend) => (
                <FriendList key={friend.name} data={friend} />
              ))}
            </div>
            <div className="appointment-info">
              <div>
                <p>약속 시간</p>
                <Space direction="vertical" size={12}>
                  <DatePicker
                    showTime={{
                      format: "HH:mm",
                    }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={onChange}
                    onOk={onOk}
                  />
                </Space>
              </div>
              <div>
                <p>약속 장소</p>
                <Input
                  placeholder="약속장소"
                  name="location"
                  value={appointment.location}
                  onChange={handleAppointmentChange}
                />
              </div>
              <div>
                <p>약속 이름</p>
                <Input
                  placeholder="약속이름"
                  name="roomName"
                  value={appointment.roomName}
                  onChange={handleAppointmentChange}
                />
              </div>
            </div>
            <div className="button-group">
              <Button
                type="primary"
                className="appointment-button"
                onClick={handleAppointment}
              >
                약속잡기
              </Button>
              <Button
                type="primary"
                className="invite-button"
                onClick={handleShowFriends}
              >
                친구초대
              </Button>
            </div>
            {visibleAppoint && renderAppointmentList()}
            {visible && renderFriendsList()}
          </div>
        </div>
      </ReactModal>
      <ReactModal
        isOpen={reviewIsOpen}
        onRequestClose={() => {
          setReviewIsOpen(false);
          navigate("/");
        }}
      >
        <Review id={id} roomPeople={roomPeople} MY_USER_ID={MY_USER_ID} />
      </ReactModal>
    </div>
  );
}
