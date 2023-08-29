import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { HomeComponent } from './home.component';

const homeRoutes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      { path: '', component: HomeDashboardComponent },
      { path: 'cliente',
	  loadChildren: () => import('../cliente/cliente.module').then(m => m.ClienteModule) },
      { path: 'receber',
      loadChildren: () => import('../receber/receber.module').then(m => m.ReceberModule) }
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
