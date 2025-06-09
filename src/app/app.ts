import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,UserComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'client';
}
