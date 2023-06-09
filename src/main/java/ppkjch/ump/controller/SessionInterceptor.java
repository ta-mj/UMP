package ppkjch.ump.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 세션 정보 검증 로직을 구현
        HttpSession session = request.getSession(false);
        // 세션 정보가 없으면 로그인 페이지로 리다이렉트
        if (session == null || session.getAttribute("userId") == null) {
            throw new Exception("세션 정보가 없음");
        }

        // 세션 정보가 유효한지 검증하는 추가 로직

        return true;
    }

}