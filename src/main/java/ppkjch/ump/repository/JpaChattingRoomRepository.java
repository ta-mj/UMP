package ppkjch.ump.repository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import ppkjch.ump.entity.ChattingRoom;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class JpaChattingRoomRepository {
    private final EntityManager em;

    public void save(ChattingRoom chattingRoom){
        em.persist(chattingRoom);
    }

    public ChattingRoom findOne(Long id){
        return em.find(ChattingRoom.class, id);
    }

    public List<ChattingRoom> findAll() {
        return em.createQuery("select cr from ChattingRoom cr", ChattingRoom.class)
                .getResultList();
    }

    public List<ChattingRoom> findById(Long id) {
        return em.createQuery("select cr from ChattingRoom cr where cr.id = :id", ChattingRoom.class)
                .setParameter("id", id)
                .getResultList();
    }
}
