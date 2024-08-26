package com.chat.mschatsocket.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    /*Se libera un broken, un broken es la comunicacion del cliente y el servidor
    * mediante sockets */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app"); //Prefijo de conexion
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //Configuracion del endpoint para que el cliente se conecte
        registry.addEndpoint("/chat-socket")
                //Cliente que podran conectarse
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }
}
