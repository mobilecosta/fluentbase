import { environment } from 'src/environments/environment'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { PoStorageService } from '@po-ui/ng-storage';
import { AuthService } from 'src/app/auth/auth.service';

const actionInsert = 'insert';
const actionUpdate = 'update';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent implements OnDestroy, OnInit {

  private readonly url: string = environment.api + '/sfj' + environment.empresa;

  private action: string = actionInsert;
  private clienteSub: Subscription;
  private paramsSub: Subscription;
  private headers: HttpHeaders;

  public cliente: any = { };

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private auth: AuthService) { }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();

    if (this.clienteSub) {
      this.clienteSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken());
    this.paramsSub = this.route.params.subscribe(params => {
      if (params['sfj_pessoa']) {
        this.loadData(params['sfj_pessoa']);
        this.action = actionUpdate;
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/cliente');
  }

  save() {
    const cliente = {...this.cliente};

    this.clienteSub = this.isUpdateOperation
      ? this.httpClient.put(`${this.url}?sfj_pessoa=eq.${cliente.sfj_pessoa}`, cliente, { headers: this.headers } )
        .subscribe(() => this.navigateToList('Cliente atualizado com sucesso'))
      : this.httpClient.post(this.url, cliente, { headers: this.headers } )
        .subscribe(() => this.navigateToList('Cliente cadastrado com sucesso'));
  }

  get isUpdateOperation() {
    return this.action === actionUpdate;
  }

  get title() {
    return this.isUpdateOperation ? 'Atualizando cliente' : 'Novo cliente';
  }

  private loadData(sfj_pessoa) {
    this.clienteSub = this.httpClient.get(`${this.url}?sfj_pessoa=eq.${sfj_pessoa}`, { headers: this.headers })
      .pipe(
        map((cliente: any) => {
          return cliente[0];
        })
      )
      .subscribe(response => this.cliente = response);
  }

  private navigateToList(msg: string) {
    this.poNotification.success(msg);

    this.router.navigateByUrl('/cliente');
  }

}
