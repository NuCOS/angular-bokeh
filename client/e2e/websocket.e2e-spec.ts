import { browser, by, element, protractor } from 'protractor';
import { spawn } from 'child_process';
import * as path from 'path';

describe('Backend websocket', () => {
  let server: any;

  beforeAll(() => {
    const python = 'python';
    const appPath = path.join(__dirname, '..', '..', 'python', 'app.py');
    server = spawn(python, [appPath], {
      cwd: path.join(__dirname, '..', '..', 'python'),
      stdio: 'inherit'
    });
    browser.waitForAngularEnabled(false);
    return browser.sleep(5000);
  });

  afterAll(() => {
    if (server) {
      server.kill();
    }
  });

  it('should render chart via websocket', async () => {
    await browser.get('http://localhost:9000/');
    const chart = element(by.css('bokeh-chart .bk-root'));
    await browser.wait(protractor.ExpectedConditions.presenceOf(chart), 10000);
    expect(await chart.isPresent()).toBe(true);
  });
});
