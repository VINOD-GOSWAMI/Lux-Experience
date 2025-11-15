import { TestConfig } from "./test-config";

export const AppUrls = {
  Home: `${TestConfig.BASE_URL}`,
  Login: `${TestConfig.BASE_URL}login`,
  Products: `${TestConfig.BASE_URL}products`,
  Cart: `${TestConfig.BASE_URL}cart`,
  About: `${TestConfig.BASE_URL}about`,
};

export  type linkType = "internal" | "external" | "all";
