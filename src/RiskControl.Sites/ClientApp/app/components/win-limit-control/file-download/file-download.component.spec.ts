import { } from 'jasmine';
import { Routes, RouterModule, PreloadAllModules, ActivatedRoute, Data } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WinLimitControlFileDownLoadComponent } from './file-download.component';
import { NavMenuComponent } from '../../navmenu/navmenu.component';
import { AuthenticationService, LoginTicket } from '../../../services/authentication.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FileDownloadService } from './file-download.service';
import { Observable } from 'rxjs/Observable';
import { Http, HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: WinLimitControlFileDownLoad', () => {
    let component: WinLimitControlFileDownLoadComponent;
    let fixture: ComponentFixture<WinLimitControlFileDownLoadComponent>;
    let mockActiveRoute: any;
    const hash = 'W0NXTF9PbmVSTkdfR3JleV9DcmVkaXRfQWxlcnRdLVJOR19DYXNpbm8tU0pLNjdEMTAxMDAxLTEyXzIwXzIwMTdfOV80M18wOV9QTS54bHN4';

    beforeEach(async(() => {
        TestBed.configureTestingModule({


            declarations: [
                WinLimitControlFileDownLoadComponent,
                NavMenuComponent
            ],
            providers: [
                FileDownloadService,
                AuthenticationService,
                LocalStorageService,
                {
                    provide: ActivatedRoute,
                    useFactory: () => mockActiveRoute
                }

            ],
            imports: [FormsModule, HttpModule, RouterModule, RouterTestingModule]

        }).compileComponents();
    }));

    beforeEach(() => {
        mockActiveRoute = {
            snapshot: {
                queryParams: {
                    hash: hash,
                }
            }
        };

        fixture = TestBed.createComponent(WinLimitControlFileDownLoadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    it('should return right file name expected', () => {
        fixture.detectChanges();
        const fileName = component.fileName;
        const expectedFileName = '[CWL_OneRNG_Grey_Credit_Alert]-RNG_Casino-SJK67D101001-12_20_2017_9_43_09_PM.xlsx';
        expect(fileName).toEqual(expectedFileName);
    });
});
