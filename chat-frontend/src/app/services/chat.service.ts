import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../models/chat-message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stopmClient:any
  //Declaracion de un listener que emitira una arreglo de mensajes a sus suscriptores, con valor inicial de vacio
  private messageSubject:BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([])

  constructor() {this.initConnectionSocket() }

  //Funcion que realiza la conexion del socket, cliente-servidor
  initConnectionSocket() {
    //URL de conexion al socket del servidor
    const url = '//localhost:3000/chat-socket'
    const socket = new SockJS(url) //Creacion del socket

    this.stopmClient = Stomp.over(socket) //Crea instancia del cliente STOMP usando el socket, permite mandar y recibir mensajes
  }

  joinRoom(roomId:string) {
    this.stopmClient.connect({},() => {
      //El cliente actual comenzara a escuchar todos los mensajes que pasen por este canal
      this.stopmClient.subscribe(`/topic/${roomId}`,(messages:any) => {
        //Obtencion del mensaje una vez procesado por el servidor
        const messageContent = JSON.parse(messages.body)
        //Obtencion del arreglo
        const currentMessage = this.messageSubject.getValue()
        currentMessage.push(messageContent) //Agregacion del nuevo elemento al arreglo

        this.messageSubject.next(currentMessage) //Emision del nuevo arreglo a todos los suscriptores
      })
    })
  }

  sendMessage(roomId:string,message:ChatMessage) {
    //Enpoint del servidor que recibe los mensajes
    this.stopmClient.send(`/app/chat/${roomId}`,{},JSON.stringify(message))
  }

  //Funcion que retorna los valores del arreglo como un observador, para que otros se suscriban a sus cambios
  getMessagesSubject() {
    return this.messageSubject.asObservable()
  }
}
