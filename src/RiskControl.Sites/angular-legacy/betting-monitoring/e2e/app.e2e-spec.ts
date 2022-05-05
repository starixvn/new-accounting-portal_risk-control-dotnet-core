import { BettingMonitoringPage } from './app.po';

describe('betting-monitoring App', () => {
  let page: BettingMonitoringPage;

  beforeEach(() => {
    page = new BettingMonitoringPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
