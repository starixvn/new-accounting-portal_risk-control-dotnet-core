// import { DebugElement } from '@angular/core';
// import { TestBed, ComponentFixture, async } from '@angular/core/testing';
// import { BrowserModule, By } from '@angular/platform-browser';
// import { Observable } from 'rxjs';
// import { of } from 'rxjs';
// import { NavbarService, Navbar } from 'nap-components/navbar';
// import { FilterService } from './filter';
// import { AppService, AppComponent, AppModule } from './index';
// import { FakeFilterService } from './filter/filter.service.spec';
// import { fakeAppService, FakeAppService } from './app.service.spec';

// class FakeNavbarService extends NavbarService {
//     query(): Observable<Navbar> {
//         const fakeNavbar: Navbar = {
//             username: 'test',
//             menus: []
//         }
//         return of(fakeNavbar);
//     }
// }

// describe('AppComponent', () => {
//     let fixture: ComponentFixture<AppComponent>;
//     let filterElement: DebugElement;
//     let iconElement: DebugElement;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 AppModule
//             ],
//             providers: [
//                 { provide: NavbarService, useClass: FakeNavbarService },
//                 { provide: AppService, useClass: FakeAppService },
//                 { provide: FilterService, useClass: FakeFilterService }
//             ]
//         });

//         fixture = TestBed.createComponent(AppComponent);
//         const appService = fixture.debugElement.injector.get(AppService);
//         fakeAppService(appService);

//         fixture.detectChanges();
//         filterElement = fixture.debugElement.query(By.css('nap-filter'));
//         iconElement = fixture.debugElement.query(By.css('.nap-header .nap-icon'));
//     });

//     it('should show filter by default', () => {
//         expect(filterElement.nativeElement.hidden).toBe(false);
//     });

//     it('should show expand icon and have title "Hide filter"', () => {
//         expect(iconElement.classes['nap-icon-header-expand']).toBe(true);
//         expect(iconElement.nativeElement.title).toBe('Hide filter');
//     });

//     describe('toggle icon', () => {
//         beforeEach(() => {
//             iconElement.triggerEventHandler('click', null);
//             fixture.detectChanges();
//         });

//         it('should hide filter', () => {
//             expect(filterElement.nativeElement.hidden).toBe(true);
//         });

//         it('should show collapse icon and have title "Show filter"', () => {
//             expect(iconElement.classes['nap-icon-header-collapse']).toBe(true);
//             expect(iconElement.nativeElement.title).toBe('Show filter');
//         });
//     });
// });
