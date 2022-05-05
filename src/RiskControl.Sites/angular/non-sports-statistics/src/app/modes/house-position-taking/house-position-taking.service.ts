import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'nap-components/http';
import { ModalService } from 'components/modal';
import { HousePositionTakingQueryModel, HousePositionTakingModel, HousePositionTaking } from './house-position-taking.model';
import { HousePositionTakingComponent } from './house-position-taking.component';

@Injectable()
export class HousePositionTakingService {
    private readonly url = 'NonSportsGamesStatistics';

    constructor(
        private readonly httpService: HttpService,
        private readonly modalService: ModalService
    ) { }

    query(model: HousePositionTakingQueryModel): Observable<HousePositionTaking[]> {
        const url = `${this.url}/HousePostitionTaking/Query`;
        return this.httpService.post<HousePositionTaking[]>(url, model);
    }

    show(model: HousePositionTakingQueryModel, userName: string) {
        this.query(model).subscribe(housePositionTakings => {
            const houstPositionTakingModel: HousePositionTakingModel = {
                userName: userName,
                housePositionTakings: housePositionTakings
            };
            this.modalService.open(HousePositionTakingComponent, { size: { width: 400 } }, houstPositionTakingModel);
        });
    }
}
