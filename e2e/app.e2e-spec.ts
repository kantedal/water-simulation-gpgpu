import { WaterSimulationGpgpuPage } from './app.po';

describe('water-simulation-gpgpu App', function() {
  let page: WaterSimulationGpgpuPage;

  beforeEach(() => {
    page = new WaterSimulationGpgpuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
