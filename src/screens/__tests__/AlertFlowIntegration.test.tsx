import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import { PriceAlertsScreen } from "@screens/PriceAlertsScreen/PriceAlertsScreen";
import { CreateAlertScreen } from "@screens/CreateAlertScreen/CreateAlertScreen";

describe("Integration - Fluxo Completo de Gestão de Alertas de Preço", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("1. deve exibir estado vazio na lista e disparar navegação ao acionar botão de criar", async () => {
    const { findByText, getByRole } = await render(
      <AlertProvider>
        <PriceAlertsScreen />
      </AlertProvider>
    );

    expect(await findByText("No alerts yet")).toBeTruthy();

    const createBtn = getByRole("button", { name: "New Alert" });
    await fireEvent.press(createBtn);

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
    await fireEvent.changeText(priceInput, "-50");
    expect(saveBtn.props.accessibilityState).toEqual({ disabled: true });
  });

  it("3. deve carregar e exibir alertas existentes na lista e permitir exclusão com persistência", async () => {
    const existingAlerts = [
      {
        id: "alert-btc-1",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 75000,
        condition: "below" as const,
        createdAt: "2026-03-01T12:00:00.000Z",
      },
    ];

    // Prepara o AsyncStorage antes da renderização para simular dados já gravados
    await AsyncStorage.setItem("cryptoAlerts", JSON.stringify(existingAlerts));

    const { getByText, getByLabelText, queryByText } = await render(
      <AlertProvider>
        <PriceAlertsScreen />
      </AlertProvider>
    );

    // Aguarda a hidratação assíncrona do AlertProvider e exibição do AlertCard real
    await waitFor(() => {
      expect(getByText("Bitcoin")).toBeTruthy();
      expect(getByText("below")).toBeTruthy();
      expect(getByText("$75,000.00")).toBeTruthy();
    });

    // Aciona o botão acessível de exclusão do alerta
    const deleteBtn = getByLabelText("Delete alert");
    await fireEvent.press(deleteBtn);

    // Valida que o alerta foi removido da tela e o estado vazio voltou a ser exibido
    await waitFor(() => {
      expect(queryByText("Bitcoin")).toBeNull();
      expect(getByText("No alerts yet")).toBeTruthy();
    });

    // Valida que a exclusão foi persistida no AsyncStorage
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("cryptoAlerts", "[]");
    });
  });
});
