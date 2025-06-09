import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   constructor(private http: HttpClient) {}
   
   getUsers(page: number = 1, limit: number = 10 , date?:string) {
    let apiUrl = `/user/get-users?page=${page}&limit=${limit}`;
    if(date){
      apiUrl+=`&date=${date}`
    } 
    console.log("apiUrl : " , apiUrl)
    return this.http.get<any>(apiUrl);
  }
}
