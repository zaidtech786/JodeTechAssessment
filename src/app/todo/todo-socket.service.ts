import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoSocketService {
  private socket: Socket;
  private todosSubject = new BehaviorSubject([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private zone: NgZone) {
    this.socket = io("http://localhost:5000", { transports: ['websocket'] });
this.socket.on('connect', () => console.log('Socket connected:', this.socket.id));
this.socket.on('connect_error', err => console.error('Connection error:', err));

    // Listen server -> 'todosUpdate'
   this.socket.on('todosUpdate', (data: any) => {
  console.log('Received todosUpdate:', data);
  this.zone.run(() => {
    this.todosSubject.next(data); // no delay, no debounce
  });
});

  }

  // Optional: disconnect on destroy if you hook it in a service lifecycle
}
