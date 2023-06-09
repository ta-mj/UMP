import React, { useState, useEffect } from "react";
import "./FriendList.css";
import { Button, Modal } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

export default function FriendList(props) {
  const { id, name, text, appointmentScore } = props.data;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

  useEffect(() => {
    let storedColor = localStorage.getItem(name);
    if (!storedColor) {
      storedColor = getRandomColor();
      localStorage.setItem(name, storedColor);
    }
    setBackgroundColor(storedColor);
  }, []);

  const handleDeleteClick = () => {
    setConfirmModalTitle("친구 삭제");
    setConfirmModalIsOpen(true);
  };

  const deleteFriend = () => {
    axios({
      method: "delete",
      url: "/friend",
      headers: {
        "Content-Type": `application/json`,
      },
      params: { friendId: id },
      withCredentials: true,
    })
      .then((response) => {
        alert(`${name}님을 친구 삭제하였습니다`);
        setConfirmModalIsOpen(false);
        setModalIsOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const handleBlockClick = () => {
    setConfirmModalTitle("친구 차단");
    setConfirmModalIsOpen(true);
  };

  const getRandomColor = () => {
    const colors = [
      "#FF5B5B",
      "#FFBB",
      "#FFE66D",
      "#9ED763",
      "#3EBDFF",
      "#A36CFF",
      "#FF7EB1",
      "#ADADAD",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const photoStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    color: "black",
    marginRight: "20px",
    backgroundColor: backgroundColor,
    fontSize: "14px",
  };

  const attendanceData = [
    { name: "참석", value: appointmentScore.numAttend },
    { name: "불참", value: appointmentScore.numNotAttend },
    { name: "지각", value: appointmentScore.numLate },
  ];
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = outerRadius + 20;
    const radiusOffset = radius + 30;
    const x = cx + radiusOffset * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radiusOffset * Math.sin(-midAngle * (Math.PI / 180));

    // 각 막대 끝에 표시할 레이블
    const labelText =
      index === 0 ? "참석" : index === 1 ? "불참" : index === 2 ? "지각" : "";

    return (
      percent && (
        <text
          x={x}
          y={y}
          fill="black"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
          <tspan x={x} dy={15}>
            {labelText}
          </tspan>
        </text>
      )
    );
  };

  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="pie-chart-legend">
        {payload.map((entry, index) => (
          // <li key={`legend-${index}`}>
          <span
            className="legend-icon"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></span>
          //   {/* <span className="legend-label">
          //     {attendanceData[index].name}: {attendanceData[index].value}
          //   </span> */}
          // // </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="friend-list-item" onClick={() => setModalIsOpen(true)}>
        <div className="friend-photo" style={photoStyle}>
          {name}
        </div>
        <div className="friend-info">
          <div className="friend-title">{name}</div>
          <p className="friend-snippet">
            {props.MY_USER_ID !== id ? text : "내 정보"}
          </p>
        </div>
      </div>
      <Modal
        visible={modalIsOpen}
        onCancel={() => setModalIsOpen(false)}
        footer={null}
      >
        <div className="friend-modal-content">
          <div className="friend-modal-item">
            <div className="friend-photo" style={photoStyle}>
              {name}
            </div>
            <div className="friend-info">
              <h1 className="friend-title">{name + "(" + id + ")"}</h1>
            </div>
          </div>
          <div className="attendance-rate-container">
            <h2>
              약속 참여율: 참석 : {appointmentScore.numAttend}, 불참 :{" "}
              {appointmentScore.numNotAttend}, 지각 : {appointmentScore.numLate}
            </h2>
            <PieChart width={400} height={400}>
              <Pie
                data={attendanceData}
                cx={200}
                cy={200}
                outerRadius={80}
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {attendanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="middle"
                height={36}
                align="right"
                content={renderLegend}
              />
            </PieChart>
          </div>
        </div>
        {props.MY_USER_ID !== id && (
          <div
            className="friend-modal-buttons"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              onClick={handleDeleteClick}
              style={{ marginRight: "10px" }}
            >
              삭제
            </Button>
          </div>
        )}
      </Modal>
      <Modal
        title={confirmModalTitle}
        visible={confirmModalIsOpen}
        onCancel={() => setConfirmModalIsOpen(false)}
        onOk={deleteFriend}
        okButtonProps={{ style: { float: "left" } }}
        okText="예"
        cancelText="아니오"
      >
        {`${
          confirmModalTitle === "친구 삭제"
            ? `${name}을(를) 삭제`
            : `${name}을(를) 차단`
        }하시겠습니까?`}
      </Modal>
    </>
  );
}
