import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model:any={};
  @Input() usersFromHomeComponent:any
  @Output() cancelRegister=new EventEmitter();
  constructor(private accountService:AccountService, private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  }
   register(){
     this.accountService.register(this.model).subscribe(response=>{
       console.log(response)
       this.cancel();
     },error=>{
       this.toastr.error(error.error)
     })
   }
   cancel(){
    this.cancelRegister.emit(false);
   }
}
