import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  {
    path:"",component:HomeComponent
  },
  {path:"",canActivate:[AuthGuard],runGuardsAndResolvers:'always',
 children:[
      
  {path:"members",component:MemberListComponent},
  {path:"members/:id",component:MemberDetailsComponent},
  {path:"lists",component:ListsComponent},
  {path:"messages",component:MessagesComponent}
 ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
