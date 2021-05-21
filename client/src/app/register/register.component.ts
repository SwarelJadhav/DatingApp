import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import {ToastrService} from 'ngx-toastr'
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm:FormGroup
  maxDate:Date
  validationErrors:string[]=[]
  @Input() usersFromHomeComponent:any
  @Output() cancelRegister=new EventEmitter();
  constructor(private accountService:AccountService, private router:Router,private toastr: ToastrService,
    private fb:FormBuilder
    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate=new Date()
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
  }
  initializeForm(){
    this.registerForm=this.fb.group({
      gender:['male'],
      username:["",Validators.required],
      knownAs:["",Validators.required],
      dateOfBirth:["",Validators.required],
      city:["",Validators.required],
      country:["",Validators.required],
      password:["",[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
      confirmPassword:["",[Validators.required,this.matchValues("password")]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }
  matchValues(matchTo:string):ValidatorFn{
    return(control:AbstractControl)=>{
      return control?.value===control?.parent?.controls[matchTo].value?
      null:{isMatching:true}
    }
  }
   register(){
     debugger;
     this.accountService.register(this.registerForm.value).subscribe(response=>{
       this.router.navigateByUrl("/members")
     },error=>{
      this.validationErrors=error
     })
   }
   cancel(){
    this.cancelRegister.emit(false);
   }
}
