import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { TreeviewModule } from 'ngx-treeview';
import { FormsModule } from '@angular/forms';
import { RuleTitleTreeviewPipe } from '../common/pipe/rule-title-treeview.pipe';
import { HttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { ToastModule } from 'nap-components/toast';
import { SpinnerModule } from 'nap-components/spinner';
import { AuthenticationModule } from 'nap-components/authentication';
import { ProductTreeviewPipe } from '../common/pipe/product-treeview.pipe';
import { GridComponent } from './grid/grid.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationConfig, PaginationModule } from 'nap-components/pagination';
import { RuleComponent } from './rule/rule.component';

@Injectable()
export class CustomPaginationConfig extends PaginationConfig {
    pageSizes = [50, 100, 200, 300, 500];
    itemsPerPage = 50;
}

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    RuleTitleTreeviewPipe,
    ProductTreeviewPipe,
    GridComponent,
    RuleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TreeviewModule.forRoot(),
    HttpModule.forRoot(),
    NavbarModule.forRoot(),
    ToastModule.forRoot(),
    SpinnerModule.forRoot(),
    AuthenticationModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
  ],
  providers: [
    { provide: PaginationConfig, useClass: CustomPaginationConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly navbarService: NavbarService) {
    navbarService.url = 'state-api/application/header';
    navbarService.userMenus = [
      {
        name: 'Change Password',
        link: 'Auth/ChangePassword'
      },
      {
        name: 'Sign Out',
        link: 'Auth/LogOut'
      }
    ];
  }
 }
