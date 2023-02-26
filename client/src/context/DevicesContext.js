import { createContext, useState } from "react";
import {
  GetFromLocalStorage,
  StoreToLocalStorage,
} from "../Services/localStorageService";

export const DevicesContext = createContext();

export function DevicesProvider({ children }) {
  function setDevicesNumber(number) {
    StoreToLocalStorage(
      "devices",
      number,
      new Date().setDate(new Date().getDate() + 7)
    );
  }

  function getDevicesNumber() {
    return GetFromLocalStorage("devices");
  }

  return (
    <DevicesContext.Provider value={{ setDevicesNumber, getDevicesNumber }}>
      {children}
    </DevicesContext.Provider>
  );
}
