import { WinLimitControlPage } from './app.po';

describe('win-limit-control App', () => {
  let page: WinLimitControlPage;

  beforeEach(() => {
    page = new WinLimitControlPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
