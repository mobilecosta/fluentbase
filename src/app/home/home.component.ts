import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoStorageService } from '@po-ui/ng-storage';
import { PoMenuItem } from '@po-ui/ng-components';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  title = 'Sistema de Controle de Veículos';

  menus: Array<PoMenuItem> = [
    { label: 'Home', link: '/home', icon: 'po-icon-home', shortLabel: 'Principal' },
    { label: 'Clientes', link: './cliente', icon: 'po-icon-company', shortLabel: 'Clientes' },
    { label: 'Receber', link: './receber', icon: 'po-icon-finance', shortLabel: 'Titulos a Receber' },
    { label: 'Logout', action: this.logout.bind(this), icon: 'po-icon-users', shortLabel: 'Logout'  }
  ];

  constructor(private router: Router, private httpClient: HttpClient, private storage: PoStorageService) { }

  logout(): void {
    var url = environment.api + '/rpc/sys_destroy_session' + environment.empresa;
    var body: any;

    this.httpClient.post(url, body)
        .subscribe(() => this.storage.remove('isLoggedIn').then(() => {
          this.router.navigate(['/login']);
        }) );

  }

}
