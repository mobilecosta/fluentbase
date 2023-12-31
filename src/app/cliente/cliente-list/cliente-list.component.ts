import { environment } from 'src/environments/environment'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PoStorageService } from '@po-ui/ng-storage';

import { Subscription } from 'rxjs';

import {
  PoCheckboxGroupOption, PoRadioGroupOption, PoDisclaimer, PoDisclaimerGroup,
  PoModalComponent, PoModalAction, PoNotificationService, PoPageFilter, PoPageAction,
  PoTableAction, PoTableColumn, PoTableComponent
} from '@po-ui/ng-components';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html'
})
export class ClienteListComponent implements OnInit, OnDestroy {

  private readonly url: string = environment.api + '/sfj' + environment.empresa;

  private clienteRemoveSub: Subscription;
  private clientesSub: Subscription;
  private offset: number = 1;
  private limit: number = 13;
  private order: string;
  private searchTerm: string = '';
  private searchFilters: any;
  private headers: HttpHeaders;

  public readonly actions: Array<PoPageAction> = [
    { action: this.onNewCliente.bind(this), label: 'Cadastrar', icon: 'po-icon-user-add' },
    { action: this.onRemoveClientes.bind(this), label: 'Remover clientes' },
    { action: this.ngOnInit(), label: 'Pagina Inicial' }
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
    { property: 'sfj_pessoa', label: 'Código' },
    { property: 'sfj_nome', label: 'Nome' },
    { property: 'sfj_fone', label: 'Telefone' }
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
    { action: this.onViewCliente.bind(this), label: 'Visualizar' },
    { action: this.onEditCliente.bind(this), label: 'Editar' },
    { action: this.onRemoveCliente.bind(this), label: 'Remover', type: 'danger', separator: true }
  ];

  public clientes: Array<any> = [];
  public hasNext: boolean = false;
  public loading: boolean = true;
  public sfj_nome: string;

  @ViewChild('advancedFilter', { static: true }) advancedFilter: PoModalComponent;
  @ViewChild('table', { static: true }) table: PoTableComponent;
  authService: any;

  constructor(private httpClient: HttpClient, private router: Router, 
              private poNotification: PoNotificationService,
              private auth: AuthService) { }

  ngOnInit() {
    this.order = "sfj_pessoa";
    let params: any = {
      offset: 1,
      limit: this.limit,
      order: this.order
    };

    this.loadData(params);
  }

  ngOnDestroy() {
    this.clientesSub.unsubscribe();

    if (this.clienteRemoveSub) {
      this.clienteRemoveSub.unsubscribe();
    };
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

    this.clientesSub = this.httpClient.get(this.url, { headers: this.headers, params: <any>params })
      .subscribe((response: any) => {
        this.clientes = response;
        this.hasNext = this.clientes.length == this.limit;
        this.loading = false;
      });
  }

  private onActionSearch() {
    this.disclaimerGroup.disclaimers = [{
      label: `Pesquisa rápida: ${this.searchTerm}`,
      property: 'sfj_nome',
      value: 'like.*' + this.searchTerm + '*'
    }];
  }

  private onChangeDisclaimerGroup(disclaimers: Array<PoDisclaimer>) {
    this.searchFilters = {};

    let params: any = { offset: 1, limit: this.limit, order: this.order };

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

  private onEditCliente(cliente) {
    this.router.navigateByUrl(`/cliente/edit/${cliente.sfj_pessoa}`);
  }

  private onNewCliente() {
    this.router.navigateByUrl('/cliente/new');
  }

  private onRemoveCliente(cliente) {
    this.clienteRemoveSub = this.httpClient.delete(`${this.url}?sfj_pessoa=eq.${cliente.sfj_pessoa}`, { headers: this.headers } )
      .subscribe(() => {
        this.poNotification.warning('Cliente ' + cliente.sfj_pessoa + ' apagado com sucesso.');

        this.clientes.splice(this.clientes.indexOf(cliente), 1);
      });
  }

  private onRemoveClientes() {
    const selectedClientes = this.table.getSelectedRows();

    selectedClientes.forEach(cliente => {
      this.onRemoveCliente(cliente);
    });

  }

  private onViewCliente(cliente) {
    this.router.navigateByUrl(`/cliente/view/${cliente.sfj_pessoa}`);
  }}
