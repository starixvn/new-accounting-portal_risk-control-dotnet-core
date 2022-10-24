import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AppService, BalanceUpModel } from './index';

const fakeBalanceUpModel: BalanceUpModel = {
    today: '2017-08-17T23:47:21.8070569-04:00',
    balanceUpRange:
    {
        balanceUpDay: '2017-07-28T00:00:00', moveBetsDay: '2017-08-06T00:00:00'
    }
};

export class FakeAppService extends AppService {
    getBalanceup(): Observable<BalanceUpModel> {
        return of(fakeBalanceUpModel);
    }
}

export function fakeAppService(appService: AppService) {
    spyOn(appService, 'getBalanceup').and.returnValue(of(fakeBalanceUpModel));
}
