import { environment } from 'src/environments/environment'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-receber-view',
  templateUrl: './receber-view.component.html'
})
export class ReceberViewComponent implements OnDestroy, OnInit {

  private readonly url: string = environment.api + '/san' + environment.filial;

  private receberRemoveSub: Subscription;
  private receberSub: Subscription;
  private paramsSub: Subscription;
  private headers: HttpHeaders;

  receber: any = {};

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private auth: AuthService) { }

  ngOnInit() {
    this.headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken());
    this.paramsSub = this.route.params.subscribe(params => this.loadData(params['recno']));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.receberSub.unsubscribe();

    if (this.receberRemoveSub) {
      this.receberRemoveSub.unsubscribe();
    }
  }

  back() {
    this.router.navigateByUrl('receber');
  }

  edit() {
    this.router.navigateByUrl(`receber/edit/${this.receber.recno}`);
  }

  remove() {
    this.receberRemoveSub = this.httpClient.delete(`${this.url}?recno=eq.${this.receber.recno}`, { headers: this.headers })
      .subscribe(() => {
        this.poNotification.warning('Titulo a receber apagado com sucesso.');

        this.back();
      });
  }

  private loadData(id) {
    this.receberSub = this.httpClient.get(`${this.url}?recno=eq.${id}`, { headers: this.headers })
      .pipe(
        map((receber: any) => {
          return receber[0];
        })
      )
      .subscribe(response => this.receber = response);
  }

}
