import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { AlertCard } from "../AlertCard";
import type { PriceAlert } from "@context/AlertProvider/useAlertProvider";

describe("Component - AlertCard", () => {
  const mockAlertAbove: PriceAlert = {
    id: "alert-123",
    cryptocurrency: "Bitcoin",
    symbol: "BTC",
    targetPrice: 65000,
    condition: "above",
    createdAt: "2026-03-01T10:00:00.000Z",
  };

  const mockAlertBelow: PriceAlert = {
    id: "alert-456",
    cryptocurrency: "Ethereum",
    symbol: "ETH",
    targetPrice: 3200,
    condition: "below",
    createdAt: "2026-03-01T11:00:00.000Z",
  };

  it("deve renderizar os dados do alerta com condição 'above' e preço formatado", async () => {
    const onDelete = jest.fn();
    const { getByText, getByLabelText } = await render(
      <AlertCard alert={mockAlertAbove} onDelete={onDelete} />
    );

    expect(getByText("Bitcoin")).toBeTruthy();
    expect(getByText("above")).toBeTruthy();
    expect(getByText("$65,000.00")).toBeTruthy();
    expect(getByLabelText("Delete alert")).toBeTruthy();
  });

  it("deve renderizar os dados do alerta com condição 'below'", async () => {
    const onDelete = jest.fn();
    const { getByText } = await render(
      <AlertCard alert={mockAlertBelow} onDelete={onDelete} />
    );

    expect(getByText("Ethereum")).toBeTruthy();
    expect(getByText("below")).toBeTruthy();
    expect(getByText("$3,200.00")).toBeTruthy();
  });

  it("deve chamar onDelete com o ID correto do alerta ao clicar no botão de exclusão", async () => {
    const onDelete = jest.fn();
    const { getByLabelText } = await render(
      <AlertCard alert={mockAlertAbove} onDelete={onDelete} />
    );

    const deleteBtn = getByLabelText("Delete alert");
    fireEvent.press(deleteBtn);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("alert-123");
  });
});
