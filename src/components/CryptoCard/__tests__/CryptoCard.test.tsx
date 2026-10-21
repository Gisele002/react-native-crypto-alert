import React from "react";
import { render } from "@testing-library/react-native";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import { CryptoCard } from "../CryptoCard";

describe("Component - CryptoCard", () => {
  it("deve renderizar os dados da criptomoeda com variação positiva", async () => {
    const { getByText } = await render(
      <AlertProvider>
        <CryptoCard
          crypto={{
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            price: 68000,
            change24h: 3.5,
          }}
        />
      </AlertProvider>
    );

    expect(getByText("Bitcoin")).toBeTruthy();
    expect(getByText("BTC")).toBeTruthy();
    expect(getByText("$68,000.00")).toBeTruthy();
    expect(getByText("+3.50%")).toBeTruthy();
  });

  it("deve renderizar criptomoeda com variação negativa", async () => {
    const { getByText } = await render(
      <AlertProvider>
        <CryptoCard
          crypto={{
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            price: 3500,
            change24h: -1.2,
          }}
        />
      </AlertProvider>
    );

    expect(getByText("Ethereum")).toBeTruthy();
    expect(getByText("-1.20%")).toBeTruthy();
  });
});
