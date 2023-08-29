import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceberFormComponent } from './receber-form/receber-form.component';
import { ReceberListComponent } from './receber-list/receber-list.component';
import { ReceberViewComponent } from './receber-view/receber-view.component';

const routes: Routes = [
  { path: '', component: ReceberListComponent },
  { path: 'new', component: ReceberFormComponent },
  { path: 'view/:recno', component: ReceberViewComponent },
  { path: 'edit/:recno', component: ReceberFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceberRoutingModule { }
