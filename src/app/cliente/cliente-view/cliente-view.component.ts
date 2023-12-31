import { environment } from 'src/environments/environment'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html'
})
export class ClienteViewComponent implements OnDestroy, OnInit {

  private readonly url: string = environment.api + '/sfj' + environment.empresa;

  private clienteRemoveSub: Subscription;
  private clienteSub: Subscription;
  private paramsSub: Subscription;
  private headers: HttpHeaders;

  cliente: any = {};

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private auth: AuthService) { }

  ngOnInit() {
    this.headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken());
    this.paramsSub = this.route.params.subscribe(params => this.loadData(params['sfj_pessoa']));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.clienteSub.unsubscribe();

    if (this.clienteRemoveSub) {
      this.clienteRemoveSub.unsubscribe();
    }
  }

  back() {
    this.router.navigateByUrl('cliente');
  }

  edit() {
    this.router.navigateByUrl(`cliente/edit/${this.cliente.sfj_pessoa}`);
  }

  remove() {
    this.clienteRemoveSub = this.httpClient.delete(`${this.url}?sfj_pessoa=eq.${this.cliente.sfj_pessoa}`, { headers: this.headers })
      .subscribe(() => {
        this.poNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.back();
      });
  }

  private loadData(id) {
    this.clienteSub = this.httpClient.get(`${this.url}?sfj_pessoa=eq.${id}`, { headers: this.headers })
      .pipe(
        map((cliente: any) => {
          return cliente[0];
        })
      )
      .subscribe(response => this.cliente = response);
  }

}
