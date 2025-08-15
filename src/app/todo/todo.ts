import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { TodoSocketService } from './todo-socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  imports: [FormsModule,CommonModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css'
})
export class Todo {
  
 inputText = ''
 todosData:any[] = []

  constructor(
    private api: TodoService,
    private socketSvc: TodoSocketService
  ) {}

  ngOnInit(): void {
    // Initial list
    this.api.getTodos().subscribe({
      next: (data:any) => (this.todosData = data || []),
      error: () => (this.todosData = []),
    });

    // Realtime updates
    this.socketSvc.todos$.subscribe((list) => {
      this.todosData = [...list]; 
      console.log("List : ",list)
    });
    // this.socketSvc.todos$.subscribe((list) => console.log("List : ",list));
  }

 addTodo(){
   this.todosData.push(this.inputText)
 }
}
