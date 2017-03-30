import { KmAdminPage } from './app.po';

describe('km-admin App', () => {
  let page: KmAdminPage;

  beforeEach(() => {
    page = new KmAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
