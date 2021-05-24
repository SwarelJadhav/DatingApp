import { importType } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/User';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import {take} from 'rxjs/operators'

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
members:Member[];
pagination:Pagination
userParams:UserParams;
user:User;
genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]
  constructor(private memberService:MemberService) {
    debugger;
    this.userParams=this.memberService.getUserParams()
   }

  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers(){
    debugger;
    this.memberService.setUserParams(this.userParams)
    this.memberService.getMembers(this.userParams).subscribe(response=>{
      this.members=response.result;
      this.pagination=response.pagination;
    })
  }
  resetFilters(){
    this.userParams=this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event:any){
    debugger;
    this.userParams.pageNumber=event.page;
    this.memberService.setUserParams(this.userParams)
    this.loadMembers();
  }
}
