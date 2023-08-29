import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { ReceberRoutingModule } from './receber-routing.module';
import { ReceberFormComponent } from './receber-form/receber-form.component';
import { ReceberListComponent } from './receber-list/receber-list.component';
import { ReceberViewComponent } from './receber-view/receber-view.component';

@NgModule({
  declarations: [
    ReceberFormComponent,
    ReceberListComponent,
    ReceberViewComponent
  ],
  imports: [
    SharedModule,

    ReceberRoutingModule
  ]
})
export class ReceberModule { }
