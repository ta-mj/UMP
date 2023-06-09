package ppkjch.ump.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TextMessageDTO {
    private String senderId;
    private String roomId;
    private String textMsg;
    private String sendTime;
    private String sendName;
}
