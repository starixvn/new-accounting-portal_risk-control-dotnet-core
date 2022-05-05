import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NavbarService, UserMenu } from 'nap-components/navbar';

@Injectable()
export class CustomNavbarService extends NavbarService {
  private readonly _userMenus: UserMenu[] = [
    {
      name: 'Change Password',
      link: 'Auth/ChangePassword'
    },
    {
      name: 'Sign Out',
      link: 'Auth/LogOut'
    }
  ];

  get userMenus(): UserMenu[] {
    return this._userMenus;
  }
}
