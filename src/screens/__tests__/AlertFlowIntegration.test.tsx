import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import { PriceAlertsScreen } from "@screens/PriceAlertsScreen/PriceAlertsScreen";
import { CreateAlertScreen } from "@screens/CreateAlertScreen/CreateAlertScreen";
import * as priceAlertsScreenHook from "@screens/PriceAlertsScreen/usePriceAlertsScreen";

describe("Integration - Fluxo Completo de Gestão de Alertas de Preço", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1. deve exibir estado vazio na lista e disparar navegação ao acionar botão de criar", async () => {
    const { findByText, getByRole } = await render(
      <AlertProvider>
        <PriceAlertsScreen />
      </AlertProvider>
    );

    expect(await findByText("No alerts yet")).toBeTruthy();

    const createBtn = getByRole("button", { name: "New Alert" });
    fireEvent.press(createBtn);

    expect(router.push).toHaveBeenCalledWith("/alerts/create");
  });

  it("2. deve renderizar a tela de criação com campos obrigatórios e botão inicialmente desabilitado", async () => {
    const { getByText, getByRole, getByPlaceholderText } = await render(
      <AlertProvider>
        <CreateAlertScreen />
      </AlertProvider>
    );

    expect(getByText("Create Alert")).toBeTruthy();
    expect(getByText("Target Price (USD)")).toBeTruthy();
    expect(getByText("Alert Condition")).toBeTruthy();

    const saveBtn = getByRole("button", { name: "Save Alert" });
    expect(saveBtn.props.accessibilityState).toEqual({ disabled: true });

    // Testa preenchimento com valor inválido
    const priceInput = getByPlaceholderText("0.00");
    fireEvent.changeText(priceInput, "-50");
    expect(saveBtn.props.accessibilityState).toEqual({ disabled: true });
  });

  it("3. deve carregar e exibir alertas existentes na lista e acionar exclusão", async () => {
    const mockDelete = jest.fn();
    jest.spyOn(priceAlertsScreenHook, "usePriceAlertsScreen").mockReturnValue({
      alerts: [
        {
          id: "alert-btc-1",
          cryptocurrency: "Bitcoin",
          symbol: "BTC",
          targetPrice: 75000,
          condition: "below",
          createdAt: "2026-03-01T12:00:00.000Z",
        },
      ],
      deleteAlert: mockDelete,
      goToCreate: jest.fn(),
    });

    const { getByText, getByLabelText } = await render(
      <AlertProvider>
        <PriceAlertsScreen />
      </AlertProvider>
    );

    expect(getByText("Bitcoin")).toBeTruthy();
    expect(getByText("below")).toBeTruthy();
    expect(getByText("$75,000.00")).toBeTruthy();

    const deleteBtn = getByLabelText("Delete alert");
    fireEvent.press(deleteBtn);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith("alert-btc-1");
  });
});
