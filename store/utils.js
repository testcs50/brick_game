import { defaultStore } from "./consts";

export const randomIntFromInterval = (toNumber) => Math.floor(Math.random() * (toNumber + 1));
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const lsStoreName = "lsStoreName";

export const getLSStore = () => {
  let store = localStorage.getItem(lsStoreName);

  if (!store) {
    store = defaultStore;
  }

  return store;
};
