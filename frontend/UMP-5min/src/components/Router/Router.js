import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "../RegisterPage/RegisterPage";
import LoginPage from "../LoginPage/LoginPage";
import Home from "../Home/Home";
import React from "react";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 이중 라우팅 때문에 애스터리스크 필요 */}
        <Route path="/*" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
