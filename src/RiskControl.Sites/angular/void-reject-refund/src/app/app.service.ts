import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { BalanceUpModel } from './common/model';

@Injectable()
export class AppService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    getBalanceup(): Observable<BalanceUpModel> {
        return this.httpService.post<BalanceUpModel>('api/application/balance-up');
    }
}
