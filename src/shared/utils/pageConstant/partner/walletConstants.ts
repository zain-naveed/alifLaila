import { CoinAsset1, PriceConvertIcon } from "assets";

const Tabs = ["Aliflaila Payments", "User Spendings"];
const TabsEnums = {
  aliflailaPayments: "Aliflaila Payments",
  userSpending: "User Spendings",
};

const walletConstant: {
  Icon: any;
  heading: string;
  price: string;
}[] = [
  {
    Icon: CoinAsset1,
    heading: "Total Coins Earned",
    price: "543",
  },
  {
    Icon: PriceConvertIcon,
    heading: "Total Rupees Converted",
    price: "1200",
  },
];

export { Tabs, TabsEnums, walletConstant };
