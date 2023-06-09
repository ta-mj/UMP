package ppkjch.ump.service;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import ppkjch.ump.entity.User;
import ppkjch.ump.entity.Friend;
import ppkjch.ump.entity.FriendRequest;
import ppkjch.ump.entity.User;
import ppkjch.ump.exception.FriendRequestExistException;
import ppkjch.ump.repository.JpaFriendRepository;
import ppkjch.ump.repository.JpaFriendRequestRepository;
import ppkjch.ump.repository.JpaUserRepository;
@Transactional
@SpringBootTest
@ExtendWith(SpringExtension.class)

class FriendServiceTest {
    @Autowired
    public FriendService friendService;
    @Autowired
    public UserService userService;
    User U = new User();
    User M = new User();
    User P = new User();

    @Test
    @Rollback(value = false)
    void findFriendList() {
        User U = new User();
        User M = new User();
        User P = new User();
        U.setId("alexander");
        U.setPassword("123");
        U.setName("arnold");
        U.setPhone_num("01012345678");
        userService.join(U);
        M.setId("jordan");
        M.setPassword("456");
        M.setName("henderson");
        M.setPhone_num("01012345678");
        userService.join(M);
        P.setId("mohamed");
        P.setPassword("789");
        P.setName("salah");
        P.setPhone_num("01012345678");
        userService.join(P);


    }

    @Test
    @Rollback(value = false)
    void request() {
        User U = new User();
        User M = new User();
        User P = new User();
        U.setId("alexander");
        U.setPassword("123");
        U.setName("arnold");
        U.setPhone_num("01011111111");
        U.setPhone_num("01012345678");
        userService.join(U);
        M.setId("jordan");
        M.setPassword("456");
        M.setName("henderson");
        M.setPhone_num("01012345678");
        userService.join(M);
        P.setId("mohamed");
        P.setPassword("789");
        P.setName("salah");
        P.setPhone_num("01012345678");
        userService.join(P);
        //친구요청
        friendService.request(U, M);
        friendService.request(P, U);
    }

    @Test
    @Rollback(value = false)
    void findFriendRequestList() {
        User U = new User();
        User M = new User();
        User P = new User();
        U.setId("alexander");
        U.setPassword("123");
        U.setName("arnold");
        U.setPhone_num("01012345678");
        userService.join(U);
        M.setId("jordan");
        M.setPassword("456");
        M.setName("henderson");
        M.setPhone_num("01012345678");
        userService.join(M);
        P.setId("mohamed");
        P.setPassword("789");
        P.setName("salah");
        P.setPhone_num("01012345678");
        userService.join(P);

    }

    @Test
    @Rollback(value = false)
    void addFriend() {
        User U = new User();
        User M = new User();
        User P = new User();
        U.setId("alexander");
        U.setPassword("123");
        U.setName("arnold");
        U.setPhone_num("01012345678");
        userService.join(U);
        M.setId("jordan");
        M.setPassword("456");
        M.setName("henderson");
        M.setPhone_num("01012345678");
        userService.join(M);
        P.setId("mohamed");
        P.setPassword("789");
        P.setName("salah");
        P.setPhone_num("01012345678");
        userService.join(P);
        //친구 추가
        friendService.addFriend(U, M);
        friendService.addFriend(M, P);
    }

    @Test
    @Rollback(value = false)
    void removeFriend() {
        User U = new User();
        User M = new User();
        User P = new User();
        U.setId("alexander");
        U.setPassword("123");
        U.setName("arnold");
        U.setPhone_num("01012345678");
        userService.join(U);
        M.setId("jordan");
        M.setPassword("456");
        M.setName("henderson");
        M.setPhone_num("01012345678");
        userService.join(M);
        P.setId("mohamed");
        P.setPassword("789");
        P.setName("salah");
        P.setPhone_num("01012345678");
        userService.join(P);
        //M과 P중 M만 삭제
        friendService.addFriend(U,M);
        friendService.addFriend(U,P);
        friendService.removeFriend(U,M);
    }
}