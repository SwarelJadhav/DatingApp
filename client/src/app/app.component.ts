import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { User } from './_models/User';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'The Dating App';
  users:any;
  constructor(private http:HttpClient,private accountService:AccountService){}
  ngOnInit():void{
     this.getUsers();
     this.setCurrentUser();
  }
  setCurrentUser(){
    const user:User=JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }
  getUsers():void{
    this.http.get("https://localhost:44379/api/Users").subscribe(response=>{
          this.users=response
      },error=>{console.log(error)})
  }
}
