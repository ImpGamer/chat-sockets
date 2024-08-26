import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  message:string = ''
  userId:string = ''
  chat_messages:any[] = []

  constructor(private chatService:ChatService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.chatService.joinRoom("2")
    this.userId = this.route.snapshot.params["userId"]
    this.listenerMessage()
  }

  sendMessage() {
    const chatMessage = {
      message: this.message,
      user: this.userId
    } as ChatMessage
    //Sala al que mandara el mensaje y el contenido de este
    this.chatService.sendMessage("2",chatMessage)
    this.message = ''
  }

  listenerMessage() {
    //Suscripcion a la funcion del observador para capturar cualquier cambio
    this.chatService.getMessagesSubject().subscribe(messages => { //Recivo los mensajes por parte del observer
      //Por cada iteracion sobre los mensajes, me agregara un nuevo atributo "message_side" al objeto a guardar que determina si es receptor o mensajero
      this.chat_messages = messages.map((item:any) => ({
        ...item,
        message_side: item.user === this.userId ? 'sender':'receiver'
      }))
    })
  }
}
