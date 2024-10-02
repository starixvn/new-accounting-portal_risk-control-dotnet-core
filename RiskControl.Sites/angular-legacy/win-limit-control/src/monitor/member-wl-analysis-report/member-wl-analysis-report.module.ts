import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MemberWlAnalysisReportComponent } from './member-wl-analysis-report.component';
import { HttpModule } from 'nap-components/http';
import { DateModule } from 'nap-components/date';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { ProductTreeviewPipe } from './product-treeview.pipe';
import { ToastModule } from 'nap-components/toast';



@NgModule({
  declarations: [
    MemberWlAnalysisReportComponent,
    ProductTreeviewPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule.forRoot(),
    DateModule,
    NgbModalModule,
    TreeviewModule.forRoot(),
    ToastModule
  ],
  entryComponents: [
    MemberWlAnalysisReportComponent
  ],
})
export class MemberWlAnalysisReportModule { }
