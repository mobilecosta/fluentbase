import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageLogin } from '@po-ui/ng-templates';
import { PoStorageService } from '@po-ui/ng-storage';

import { LoginService } from './login.service';

import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hideRememberUser: boolean = true;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private storage: PoStorageService,
    private poNotification: PoNotificationService) { }

  loginSubmit(formData: PoPageLogin) {

    const md5 = new Md5();

    const user = Object.assign({  in_email: formData.login,
                                  in_pass: md5.appendStr(formData.password).end(),
                                  in_role: 1, in_ctx: 1 });

    this.loginService.post(user).subscribe((res) => {
      this.storage.set('isLoggedIn', 'true').then(() => {
        localStorage.setItem('access_token', res.token)
        this.router.navigate(['/']);
      });
    }, (res) => {
      if ((! res.hasOwnProperty('token')))
        { this.poNotification.error('Usuário ou senha invalidos ! Tente novamente.') };
    });
                              
  }

}
