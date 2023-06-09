package ppkjch.ump.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ppkjch.ump.entity.Friend;
import ppkjch.ump.entity.User;
import ppkjch.ump.exception.*;
import ppkjch.ump.repository.JpaFriendRepository;
import ppkjch.ump.repository.JpaUserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JpaUserRepository jpaUserRepository;
    private final JpaFriendRepository jpaFriendRepository;

    @Transactional
    public String join(User user){
            jpaUserRepository.save(user);
        return user.getId();
    }

    @Transactional
    public Long makeFriend(Friend friend){
        jpaFriendRepository.save(friend);
        return friend.getId();
    }

    public User findUser(String userId){

        User user = jpaUserRepository.findOne(userId);
        if(user == null){
            throw new NotValidUserId("해당 유저가 존재하지 않습니다.");
        }
        return user;
    }

    @Transactional
    public void signUp(String id, String name, String pw, String phoneNum ){
        if(id.equals("server")){
            throw new NotValidUserId("해당 아이디는 사용하실 수 없습니다.");
        }
        else if (findUser(id) != null) {
            throw new IdDuplicateException("이미 입력하신 아이디가 존재합니다.");
        }
        else{
            User user = new User();
            user.setId(id);
            user.setName(name);
            user.setPassword(pw);
            user.setPhone_num(phoneNum);
            jpaUserRepository.save(user);
        }
    }

    public User checkLoginException(String user_id, String user_pw){
        if(findUser(user_id) == null || !findUser(user_id).getPassword().equals(user_pw)){
            throw new loginFailException("로그인에 실패하였습니다. 아이디와 비밀번호를 다시 한번 확인해주세요.");
        }
        else{
            return findUser(user_id);
        }
    }
    @Transactional
    public void updateUser(User user, String name, String phone_num, String password){
        user.setName(name);
        user.setPhone_num(phone_num);
        user.setPassword(password);
    }

    public List<User> findFriend(User user){
        return jpaFriendRepository.findFriendList(user);
    }


    public void checkMyself(String sender, String receiver){
        if (sender.equals(receiver)){
            throw new FriendMyselfException("자신에게는 친구추가를 할 수 없습니다.");
        }
    }

}
