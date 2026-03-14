export type CityPriceProfile = {
  city: string;
  order: number;
  regularAdjustmentCpl: number;
  premiumAdjustmentCpl: number;
  dieselAdjustmentCpl: number;
  spreadCpl: number;
  submissions: number;
};

// These city basis differentials let us automate NZ city prices from a
// real upstream source today, while keeping the source layer swappable when a
// true live city-level feed becomes available.
export const CITY_PRICE_PROFILES: CityPriceProfile[] = [
  {
    city: "Auckland",
    order: 0,
    regularAdjustmentCpl: 12.72,
    premiumAdjustmentCpl: 22.93,
    dieselAdjustmentCpl: 3.6,
    spreadCpl: 14,
    submissions: 34,
  },
  {
    city: "Wellington",
    order: 1,
    regularAdjustmentCpl: 17.72,
    premiumAdjustmentCpl: 27.93,
    dieselAdjustmentCpl: 7.6,
    spreadCpl: 17,
    submissions: 28,
  },
  {
    city: "Christchurch",
    order: 2,
    regularAdjustmentCpl: 10.72,
    premiumAdjustmentCpl: 19.93,
    dieselAdjustmentCpl: 0.6,
    spreadCpl: 12,
    submissions: 21,
  },
  {
    city: "Tauranga",
    order: 3,
    regularAdjustmentCpl: 14.72,
    premiumAdjustmentCpl: 24.93,
    dieselAdjustmentCpl: 4.6,
    spreadCpl: 14,
    submissions: 19,
  },
  {
    city: "Dunedin",
    order: 4,
    regularAdjustmentCpl: 15.72,
    premiumAdjustmentCpl: 25.93,
    dieselAdjustmentCpl: 6.6,
    spreadCpl: 15,
    submissions: 12,
  },
];
