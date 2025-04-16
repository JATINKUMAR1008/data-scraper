export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  priceId: string;
};

export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999,
    priceId: "price_1RENucECO47HwgzznnN8zJaU"
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 3999,
    priceId: "price_1RENv0ECO47Hwgzzz1IRdMYH"
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999,
    priceId:"price_1RENvSECO47Hwgzz1HPzE6DK"
  },
];

export const getCreditsPack = (id: PackId) => {
  return CreditsPack.find((p) => p.id === id);
};
