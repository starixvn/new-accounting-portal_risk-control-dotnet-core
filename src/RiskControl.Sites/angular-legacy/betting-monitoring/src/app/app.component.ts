import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { BettingMonitoringModel } from './app.model'
import { ToastService, MessageType } from 'nap-components/toast';

@Component({
  selector: 'nap-app',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
  providers: [AppService]
})

export class AppComponent implements OnInit {

  model: BettingMonitoringModel = { minimumTickets: 0, threshold: 0 };
  constructor(
    private appService: AppService,
    private toastService: ToastService
  ) { }
  ngOnInit() {
    this.appService.query().subscribe(model => {
      this.model = model;
    });
  }

  save() {
    this.appService.update(this.model).subscribe(result => {
      this.toastService.activate("The Betting Monitoring setting has been updated successfully!", MessageType.Success);
    });
  }
}
