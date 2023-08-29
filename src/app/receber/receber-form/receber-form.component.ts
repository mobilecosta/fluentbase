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
  selector: 'app-receber-form',
  templateUrl: './receber-form.component.html'
})
export class ReceberFormComponent implements OnDestroy, OnInit {

  private readonly url: string = environment.api + '/san' + environment.filial;

  private action: string = actionInsert;
  private receberSub: Subscription;
  private paramsSub: Subscription;
  private headers: HttpHeaders;

  public receber: any = { };

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private auth: AuthService) { }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();

    if (this.receberSub) {
      this.receberSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken());
    this.paramsSub = this.route.params.subscribe(params => {
      if (params['recno']) {
        this.loadData(params['recno']);
        this.action = actionUpdate;
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/receber');
  }

  save() {
    const receber = {...this.receber};

    this.receberSub = this.isUpdateOperation
      ? this.httpClient.put(`${this.url}?an_codtit=eq.${receber.an_parce}&an_parce=eq.${receber.an_parce}`, receber, { headers: this.headers } )
        .subscribe(() => this.navigateToList('Receber atualizado com sucesso'))
      : this.httpClient.post(this.url, receber, { headers: this.headers } )
        .subscribe(() => this.navigateToList('Receber cadastrado com sucesso'));
  }

  get isUpdateOperation() {
    return this.action === actionUpdate;
  }

  get title() {
    return this.isUpdateOperation ? 'Atualizando Titulo Receber' : 'Novo Titulo Receber';
  }

  private loadData(recno) {
    let params: any = {
      select: 'an_codtit, an_parce, a1_codcli'
    };

    this.receberSub = this.httpClient.get(`${this.url}?recno=eq.${recno}`, 
    { headers: this.headers, params: params })
      .pipe(
        map((receber: any) => {
          return receber[0];
        })
      )
      .subscribe(response => this.receber = response);
  }

  private navigateToList(msg: string) {
    this.poNotification.success(msg);

    this.router.navigateByUrl('/receber');
  }

}
