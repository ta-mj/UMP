package ppkjch.ump.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberForm {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String password;
}
