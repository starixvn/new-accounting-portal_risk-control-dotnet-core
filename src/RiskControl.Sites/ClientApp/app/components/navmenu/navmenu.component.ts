import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'nap-nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.scss']
})
export class NavMenuComponent implements OnInit {
    menus: any;
    username: string;

    constructor(
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        const loginTicket = this.authenticationService.loginTicket;
        if (loginTicket) {
            const parentMenus = loginTicket.menus
                .filter(menu => menu.parent === null)
                .sort((menu1, menu2) => menu1.displayOrder > menu2.displayOrder ? 1 : -1);
            loginTicket.menus.forEach((menu: any) => {
                if (menu.parent !== null) {
                    parentMenus.forEach((parentMenu: any) => {
                        if (parentMenu.id === menu.parent.id) {
                            if (parentMenu.children) {
                                parentMenu.children.push(menu);
                            } else {
                                parentMenu.children = [menu];
                            }
                        }
                    });
                    menu.parent = null;
                }
            });
            this.menus = parentMenus;
            this.username = loginTicket.username;
        }
    }
}
