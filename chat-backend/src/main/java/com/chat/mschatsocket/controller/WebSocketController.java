package com.chat.mschatsocket.controller;

import com.chat.mschatsocket.dto.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class WebSocketController {
    //Ruta donde llegara el mensaje
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}") //Una vez procesado enviara el objeto "ChatMessage" a esta ruta
    public ChatMessage chat(@DestinationVariable String roomId, ChatMessage message) {
        log.info("Mensaje recibido: "+message.getMessage());
        log.info("Id del usuario que mando el mensaje: "+message.getUser());
        return new ChatMessage(message.getMessage(),message.getUser());
    }
}
