import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastrModule} from 'ngx-toastr';
import{TabsModule} from 'ngx-bootstrap/tabs'
import{NgxGalleryModule} from '@kolkov/ngx-gallery'
import {NgxSpinnerModule} from 'ngx-spinner'
import {FileUploadModule} from 'ng2-file-upload'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-right"
    }),
    TabsModule.forRoot(),
    NgxGalleryModule,
    FileUploadModule
  ],
  exports:[
    TabsModule,
    NgxGalleryModule,
    FileUploadModule
  ]
})
export class SharedModule { }
