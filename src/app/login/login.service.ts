import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PoStorageService } from '@po-ui/ng-storage';

import { GenericService } from './../generic/service/generic.service';
import { User } from '../model/user';

@Injectable()
export class LoginService extends GenericService<User> {

  path = 'rpc/sys_login_api' + environment.empresa;
  
  constructor(http: HttpClient, private storage: PoStorageService) {
    super(http);
  }

  isLoggedIn(): Promise<any> {
    return this.storage.get('isLoggedIn');
  }

}
