import { VehicleBrand, CommodityType, ScreenType } from '../types';

export class GrepTestFilterBuilder {
  private readonly lookaheads: string[];

  constructor(lookaheads: string[] = []) {
    this.lookaheads = lookaheads;
  }

  deviceType(type: ScreenType): GrepTestFilterBuilder {
    return new GrepTestFilterBuilder([...this.lookaheads, `(?=.*(@only-${type}|^(?!.*@only-)))`]);
  }

  brand(brand: VehicleBrand): GrepTestFilterBuilder {
    return new GrepTestFilterBuilder([...this.lookaheads, `(?=.*(@brand-${brand}|^(?!.*@brand-)))`]);
  }

  commodityType(type: CommodityType): GrepTestFilterBuilder {
    return new GrepTestFilterBuilder([
      ...this.lookaheads,
      `(?=.*(@runs-on-commodity-${type}|^(?!.*@runs-on-commodity-)))`,
    ]);
  }

  build(): RegExp {
    const pattern = `^${this.lookaheads.join('')}.*$`;
    return new RegExp(pattern, 'i');
  }
}
