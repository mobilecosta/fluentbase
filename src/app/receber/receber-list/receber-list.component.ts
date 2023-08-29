import { environment } from 'src/environments/environment'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  PoDisclaimer, PoDisclaimerGroup,
  PoModalComponent, PoModalAction, PoNotificationService, PoPageFilter, PoPageAction,
  PoTableAction, PoTableColumn, PoTableComponent
} from '@po-ui/ng-components';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-receber-list',
  templateUrl: './receber-list.component.html'
})
export class ReceberListComponent implements OnInit, OnDestroy {

  private readonly url: string = environment.api + '/san_v' + environment.filial;

  private receberRemoveSub: Subscription;
  private receberSub: Subscription;
  private offset: number = 1;
  private limit: number = 13;
  private order: string;
  private searchTerm: string = '';
  private searchFilters: any;
  private headers: HttpHeaders;

  public readonly actions: Array<PoPageAction> = [
    { action: this.onNewReceber.bind(this), label: 'Cadastrar', icon: 'po-icon-user-add' },
    { action: this.onRemoveRecebers.bind(this), label: 'Excluir Titulos' },
    { action: (this.ngOnInit(), this.router.navigateByUrl('/receber')), label: 'Pagina Inicial' }
  ];

  public readonly advancedFilterPrimaryAction: PoModalAction = {
    action: this.onConfirmAdvancedFilter.bind(this),
    label: 'Pesquisar'
  };

  public readonly advancedFilterSecondaryAction: PoModalAction = {
    action: () => this.advancedFilter.close(),
    label: 'Cancelar'
  };

  public readonly columns: Array<PoTableColumn> = [
    { property: 'an_codtit', label: 'Titulo' },
    { property: 'an_parce', label: 'Parcela' },
    { property: 'a1_codcli', label: 'Cliente' },
    { property: 'sfj_nome', label: 'Razao Social' },
    { property: 'an_valor', label: 'Valor', type: 'currency' },
    { property: 'an_emissao', label: 'Emissão' },
    { property: 'an_vencto', label: 'Vencto' },
    { property: 'an_venctoreal', label: 'Vencto Real' },
    { property: 'an_saldo', label: 'Saldo', type: 'currency' },
    { property: 'an_baixa', label: 'Vencto' },
    { property: 'f1_codnat', label: 'Natureza' },
    { property: 'f1_descri', label: 'Descrição' }
  ];

  public readonly disclaimerGroup: PoDisclaimerGroup = {
    change: this.onChangeDisclaimerGroup.bind(this),
    disclaimers: [ ],
    title: 'Filtros aplicados em nossa pesquisa'
  };

  public readonly filter: PoPageFilter = {
    action: this.onActionSearch.bind(this),
    advancedAction: this.openAdvancedFilter.bind(this),
    ngModel: 'searchTerm',
    placeholder: 'Pesquisa rápida ...'
  };

  public readonly tableActions: Array<PoTableAction> = [
    { action: this.onViewReceber.bind(this), label: 'Visualizar' },
    { action: this.onEditReceber.bind(this), label: 'Editar' },
    { action: this.onRemoveReceber.bind(this), label: 'Remover', type: 'danger', separator: true }
  ];

  public receber: Array<any> = [];
  public hasNext: boolean = false;
  public loading: boolean = true;
  public an_codtit: string;

  @ViewChild('advancedFilter', { static: true }) advancedFilter: PoModalComponent;
  @ViewChild('table', { static: true }) table: PoTableComponent;
  authService: any;

  constructor(private httpClient: HttpClient, private router: Router, 
              private poNotification: PoNotificationService,
              private auth: AuthService) { }

  ngOnInit() {
    this.order = "an_codtit,an_parce";
    let params: any = {
      offset: 1,
      limit: this.limit,
      order: this.order
    };

    this.loadData(params);
  }

  ngOnDestroy() {
    this.receberSub.unsubscribe();

    if (this.receberRemoveSub) {
      this.receberRemoveSub.unsubscribe();
    }
  }

  openAdvancedFilter() {
    this.advancedFilter.open();
  }

  sortBy(event) {
    this.offset = 1;
    this.order = event.column.property;
    let params: any = {
      offset: this.offset,
      limit: this.limit,
      order: this.order
    };

    if (event) {
      params.order = params.order + `${event.type === 'descending' ? '.desc' : ''}`;
    }

    this.disclaimerGroup.disclaimers.forEach(disclaimer => {
      params[disclaimer.property] = disclaimer.value
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData(params);
  }

  showMore(event) {
    this.offset = this.offset + this.limit;
    let params: any = { offset: this.offset, limit: this.limit, order: this.order };

    if (event) {
      params.order = params.order + `${event.type === 'descending' ? '.desc' : ''}`;
    };

    this.disclaimerGroup.disclaimers.forEach(disclaimer => {
      params[disclaimer.property] = disclaimer.value
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData(params);
  }

  private loadData(params: { page?: number, search?: string } = { }) {
    this.loading = true;

    this.headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken());
    this.headers.append('Range', (this.offset - 1) + '-' + (this.limit - 1))

    this.receberSub = this.httpClient.get(this.url, { headers: this.headers, params: <any>params })
      .subscribe((response: any) => {
        this.receber = response;
        this.hasNext = this.receber.length == this.limit;
        this.loading = false;
      });
  }

  private onActionSearch() {
    this.disclaimerGroup.disclaimers = [{
      label: `Pesquisa rápida: ${this.searchTerm}`,
      property: 'an_codtit',
      value: this.searchTerm
    }];
  }

  private onChangeDisclaimerGroup(disclaimers: Array<PoDisclaimer>) {
    this.searchFilters = {};

    let params: any = { offset: this.offset, limit: this.limit, order: this.order };

    disclaimers.forEach(disclaimer => {
      params[disclaimer.property] = disclaimer.value
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData(params);
  }

  private onConfirmAdvancedFilter() {
    const addDisclaimers = (property: string, value: string, label: string) =>
      value && this.disclaimerGroup.disclaimers.push({property, value, label: `${label}: ${value}`});

    this.disclaimerGroup.disclaimers = [];

    this.advancedFilter.close();
  }

  private onEditReceber(receber) {
    this.router.navigateByUrl(`/receber/edit/${receber.recno}`);
  }

  private onNewReceber() {
    this.router.navigateByUrl('/receber/new');
  }

  private onRemoveReceber(receber) {
    this.receberRemoveSub = this.httpClient.delete(`${this.url}?recno=eq.${receber.recno}`, { headers: this.headers } )
      .subscribe(() => {
        this.poNotification.warning('Titulo a receber ' + receber.an_codtit + ' apagado com sucesso.');

        this.receber.splice(this.receber.indexOf(receber), 1);
      });
  }

  private onRemoveRecebers() {
    const selectedRecebers = this.table.getSelectedRows();

    selectedRecebers.forEach(receber => {
      this.onRemoveReceber(receber);
    });

  }

  private onViewReceber(receber) {
    this.router.navigateByUrl(`/receber/view/${receber.recno}`);
  }

}
