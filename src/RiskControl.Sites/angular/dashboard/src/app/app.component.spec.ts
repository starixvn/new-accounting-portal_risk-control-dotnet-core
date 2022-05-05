import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService, Navbar } from 'nap-components/navbar';
import { ChartsModule } from 'nap-components/chart';
import { NumberFormatModule } from 'nap-components/number-format';
import { DateModule } from 'nap-components/date';
import { AppService } from './app.service';
import {
  WinLossLimit,
  TopMemberWinning,
  TopGameTypeWinning,
  CurrencyNetIncome,
  MonthlyTurnoverAndNetIncome,
  ProductTurnover,
  BalanceUpModel
} from './app.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';
import { LegendModule } from 'nap-components/legend';
import { SpinnerModule } from 'nap-components/spinner';

class FakeNavbarService extends NavbarService {
  query(): Observable<Navbar> {
    const fakeNavbar: Navbar = {
      username: 'test',
      menus: []
    }
    return of(fakeNavbar);
  }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  let appService: AppService;
  let appServiceWinLossLimitSpy: jasmine.Spy;
  let appServiceTopMemberSpy: jasmine.Spy;
  let appServiceTopGameTypeSpy: jasmine.Spy;
  let currencyNetIncomeSpy: jasmine.Spy;
  let monthlyTurnoverAndNetIncomeSpy: jasmine.Spy;
  let productTurnoverSpy: jasmine.Spy;
  let balanceUpSpy: jasmine.Spy;

  function setUp() {
    const currencyNetIncome: CurrencyNetIncome[] =
      [{ Currency: 'UUS', NetIncome: 10 }, { Currency: 'HKK', NetIncome: 5 }, { Currency: 'US$', NetIncome: 20 }];
    currencyNetIncomeSpy = spyOn(appService, 'queryCurrencyNetIncome').and.returnValue(of(currencyNetIncome));

    const monthlyTurnoverAndNetIncome: MonthlyTurnoverAndNetIncome[] =
      [{ Month: '10/2018', Turnover: 5, NetIncome: 2 },
      { Month: '11/2018', Turnover: 10, NetIncome: 5 },
      { Month: '12/2018', Turnover: 8, NetIncome: 5 },
      { Month: '01/2019', Turnover: 12, NetIncome: 10 },
      { Month: '02/2019', Turnover: 10, NetIncome: 8 },
      { Month: '03/2019', Turnover: 20, NetIncome: 15 }];
    monthlyTurnoverAndNetIncomeSpy = spyOn(appService, 'queryMonthlyTurnoverAndNetIncome').and.returnValue(of(monthlyTurnoverAndNetIncome));

    const productTurnover: ProductTurnover[] =
      [{ Product: 'UUS', Turnover: 100 }, { Product: 'HKK', Turnover: 150 }, { Product: 'US$', Turnover: 50 }];
    productTurnoverSpy = spyOn(appService, 'queryProductTurnover').and.returnValue(of(productTurnover));

    const winLossLimit: WinLossLimit[] = [
      { UserName: '12BETEURO01033', Currency: 'EURO', Product: 'PP', LimitLevel: 3 },
      { UserName: '12BETEURO01033', Currency: 'EURO', Product: 'Allbet', LimitLevel: 102 },
      { UserName: '12BETEURO01033', Currency: 'EURO', Product: 'PP', LimitLevel: 3 }];
    appServiceWinLossLimitSpy = spyOn(appService, 'queryWinLossLimit').and.returnValue(of(winLossLimit));

    const topMemberWinning: TopMemberWinning[] =
      [{ Username: 'QQMAQW11333', Currency: 'RM', GameIncome: -150 },
      { Username: 'QQMAQW11555', Currency: 'RM', GameIncome: -120 },
      { Username: 'ACGUUS3838033', Currency: 'SD$', GameIncome: -50 }];
    appServiceTopMemberSpy = spyOn(appService, 'queryTopMemberWinning').and.returnValue(of(topMemberWinning));

    const topGameTypeWinning: TopGameTypeWinning[] =
      [{ Bettype: 'BidMe', Product: 'Gold Deluxe', GameIncome: -150 },
      { Bettype: 'Roulette', Product: 'Gold Deluxe', GameIncome: -100 },
      { Bettype: 'Tales of Brothel', Product: 'RNG Casino', GameIncome: -50 }];
    appServiceTopGameTypeSpy = spyOn(appService, 'queryTopGameTypeWinning').and.returnValue(of(topGameTypeWinning));

    const balanceUpModel: BalanceUpModel = {
      today: '03/27/2019', balanceUpRange: { balanceUpDay: '02/28/2019', moveBetsDay: '03/31/2019' }
    };
    balanceUpSpy = spyOn(appService, 'getBalanceup').and.returnValue(of(balanceUpModel));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule.forRoot(),
        NavbarModule.forRoot(),
        LegendModule.forRoot(),
        SpinnerModule.forRoot(),
        DateModule,
        ChartsModule,
        NumberFormatModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: NavbarService, useClass: FakeNavbarService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.debugElement.componentInstance;
    appService = fixture.debugElement.injector.get(AppService);
    setUp();
    fixture.detectChanges();
  }));

  describe('Win Loss Limit', () => {
    it('title should be Win Loss Limit Monitor', async(() => {
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();        // update view with quote
        const debugElement: DebugElement = fixture.debugElement;
        const winlossLimitBlock = debugElement.query(By.css('div.win-loss-limit-block'));
        const cardHeader = winlossLimitBlock.nativeElement.querySelector('div.card-header');
        expect(cardHeader.innerText).toBe('Win Loss Limit Monitor');
      });
    }));

    it('header shoud render  UserName, Currency, Product, Limit Level', async(() => {
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const winlossLimitBlockLabels = debugElement.queryAll(By.css('div.win-loss-limit-block div.card-body label'));
        expect(winlossLimitBlockLabels[0].nativeElement.innerText).toBe('UserName');
        expect(winlossLimitBlockLabels[1].nativeElement.innerText).toBe('Currency');
        expect(winlossLimitBlockLabels[2].nativeElement.innerText).toBe('Product');
        expect(winlossLimitBlockLabels[3].nativeElement.innerText).toBe('Limit Level');
      });
    }));

    it('body shoud render  3 rows', async(() => {
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const winlossLimitBlockRows = debugElement.queryAll(By.css('div.win-loss-limit-block div.card-body .row.mt-1'));
        expect(winlossLimitBlockRows.length).toBe(3);
      });
    }));

    it('body shoud render right data', async(() => {
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const winlossLimitBlockRows = debugElement.queryAll(By.css('div.win-loss-limit-block div.card-body .row.mt-1'));
        expect(winlossLimitBlockRows[0].nativeElement.childNodes[0].innerText).toBe('12BETEURO01033');
        expect(winlossLimitBlockRows[0].nativeElement.childNodes[1].innerText).toBe('EURO');
        expect(winlossLimitBlockRows[0].nativeElement.childNodes[2].innerText).toBe('PP');

        expect(winlossLimitBlockRows[1].nativeElement.childNodes[0].innerText).toBe('12BETEURO01033');
        expect(winlossLimitBlockRows[1].nativeElement.childNodes[1].innerText).toBe('EURO');
        expect(winlossLimitBlockRows[1].nativeElement.childNodes[2].innerText).toBe('Allbet');

        expect(winlossLimitBlockRows[2].nativeElement.childNodes[0].innerText).toBe('12BETEURO01033');
        expect(winlossLimitBlockRows[2].nativeElement.childNodes[1].innerText).toBe('EURO');
        expect(winlossLimitBlockRows[2].nativeElement.childNodes[2].innerText).toBe('PP');
      });
    }));

    it('body shoud render right limit css class', async(() => {
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const winlossLimitBlockRows = debugElement.queryAll(By.css('div.win-loss-limit-block div.card-body .fa.fa-flag'));
        expect(winlossLimitBlockRows[0].classes['text-red']).toBeTruthy();
        expect(winlossLimitBlockRows[1].classes['text-black']).toBeTruthy();
        expect(winlossLimitBlockRows[2].classes['text-red']).toBeTruthy();
      });
    }));
  });

  describe('Top Members with High Winning (RM)', () => {
    it('title should be Top Members with High Winning (RM)', async(() => {
      // fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topMemberWinningBlock = debugElement.query(By.css('div.top-member-winning'));
        const cardHeader = topMemberWinningBlock.nativeElement.querySelector('div.card-header');
        expect(cardHeader.innerText).toBe('Top Members with High Winning (RM)');
      });
    }));

    it('header shoud render  UserName, Currency, Game Income', async(() => {
      //fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const labels = debugElement.queryAll(By.css('div.top-member-winning div.card-body label'));
        expect(labels[0].nativeElement.innerText).toBe('UserName');
        expect(labels[1].nativeElement.innerText).toBe('Currency');
        expect(labels[2].nativeElement.innerText).toBe('Game Income');
      });
    }));

    it('body shoud render  3 rows', async(() => {
      // fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topMemberWinningBlockRows = debugElement.queryAll(By.css('div.top-member-winning div.card-body .row.mt-1'));
        expect(topMemberWinningBlockRows.length).toBe(3);
      });
    }));

    it('body shoud render right data', async(() => {
      //fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topMemberWinningBlockRows = debugElement.queryAll(By.css('div.top-member-winning div.card-body .row.mt-1'));
        expect(topMemberWinningBlockRows[0].nativeElement.childNodes[0].innerText).toBe('QQMAQW11333');
        expect(topMemberWinningBlockRows[0].nativeElement.childNodes[1].innerText).toBe('RM');
        expect(topMemberWinningBlockRows[0].nativeElement.childNodes[2].innerText).toBe('-150');

        expect(topMemberWinningBlockRows[1].nativeElement.childNodes[0].innerText).toBe('QQMAQW11555');
        expect(topMemberWinningBlockRows[1].nativeElement.childNodes[1].innerText).toBe('RM');
        expect(topMemberWinningBlockRows[1].nativeElement.childNodes[2].innerText).toBe('-120');

        expect(topMemberWinningBlockRows[2].nativeElement.childNodes[0].innerText).toBe('ACGUUS3838033');
        expect(topMemberWinningBlockRows[2].nativeElement.childNodes[1].innerText).toBe('SD$');
        expect(topMemberWinningBlockRows[2].nativeElement.childNodes[2].innerText).toBe('-50');
      });
    }));
  });

  describe('Top Game Types with High Winning (RM)', () => {
    it('title should be Top Game Types with High Winning (RM)', async(() => {
      //  fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topGameWinningBlock = debugElement.query(By.css('div.top-game-winning'));
        const cardHeader = topGameWinningBlock.nativeElement.querySelector('div.card-header');
        expect(cardHeader.innerText).toBe('Top Game Types with High Winning (RM)');
      });
    }));

    it('header shoud render  Game Type, Product, Game Income', async(() => {
      // fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topGameWinningBlockLabels = debugElement.queryAll(By.css('div.top-game-winning div.card-body label'));
        expect(topGameWinningBlockLabels[0].nativeElement.innerText).toBe('Game Type');
        expect(topGameWinningBlockLabels[1].nativeElement.innerText).toBe('Product');
        expect(topGameWinningBlockLabels[2].nativeElement.innerText).toBe('Game Income');
      });
    }));

    it('body shoud render  3 rows', async(() => {
      // fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topGameWinningBlockRows = debugElement.queryAll(By.css('div.top-game-winning div.card-body .row.mt-1'));
        expect(topGameWinningBlockRows.length).toBe(3);
      });
    }));

    it('body shoud render right data', async(() => {
      // fixture.detectChanges(); // update view
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement;
        const topGameWinningBlockRows = debugElement.queryAll(By.css('div.top-game-winning div.card-body .row.mt-1'));
        expect(topGameWinningBlockRows[0].nativeElement.childNodes[0].innerText).toBe('BidMe');
        expect(topGameWinningBlockRows[0].nativeElement.childNodes[1].innerText).toBe('Gold Deluxe');
        expect(topGameWinningBlockRows[0].nativeElement.childNodes[2].innerText).toBe('-150');

        expect(topGameWinningBlockRows[1].nativeElement.childNodes[0].innerText).toBe('Roulette');
        expect(topGameWinningBlockRows[1].nativeElement.childNodes[1].innerText).toBe('Gold Deluxe');
        expect(topGameWinningBlockRows[1].nativeElement.childNodes[2].innerText).toBe('-100');

        expect(topGameWinningBlockRows[2].nativeElement.childNodes[0].innerText).toBe('Tales of Brothel');
        expect(topGameWinningBlockRows[2].nativeElement.childNodes[1].innerText).toBe('RNG Casino');
        expect(topGameWinningBlockRows[2].nativeElement.childNodes[2].innerText).toBe('-50');
      });
    }));
  });
});
