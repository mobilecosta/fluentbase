import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { ClientesRoutingModule } from './cliente-routing.module';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteViewComponent } from './cliente-view/cliente-view.component';

@NgModule({
  declarations: [
    ClienteFormComponent,
    ClienteListComponent,
    ClienteViewComponent
  ],
  imports: [
    SharedModule,

    ClientesRoutingModule
  ]
})
export class ClienteModule { }
