import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import {User} from '../_models/User'

@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl=environment.apiUrl
private currentUserSource=new ReplaySubject<User>(1);
currentUser$=this.currentUserSource.asObservable();
  constructor(private http:HttpClient) { }
  login(model:any){
    debugger;
   return this.http.post(this.baseUrl+"accounts/login",model).pipe(
     map((response:User)=>{
      const user=response;
      if(user){
        this.setCurrentUser(user)
      }
     })
   )
  }

  register(model:any){
    debugger;
   return this.http.post(this.baseUrl+"accounts/register",model).pipe(
     map((user:User)=>{
       if(user){
         this.setCurrentUser(user)
       }
       return user;
     })
   )
  }
  setCurrentUser(user:User){
     this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null)
  }
}
