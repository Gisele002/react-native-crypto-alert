import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { AlertProvider } from "../AlertProvider";
import { useAlerts } from "../useAlertProvider";

function TestConsumer() {
  const { alerts, addAlert, deleteAlert } = useAlerts();

  return (
    <View>
      <Text testID="alert-count">{alerts.length}</Text>
      {alerts.map((alert) => (
        <View key={alert.id}>
          <Text testID={`alert-name-${alert.id}`}>{alert.cryptocurrency}</Text>
          <Text testID={`alert-price-${alert.id}`}>{alert.targetPrice}</Text>
          <TouchableOpacity
            testID={`delete-btn-${alert.id}`}
            onPress={() => deleteAlert(alert.id)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        testID="add-alert-btn"
        onPress={() =>
          addAlert({
            cryptocurrency: "Ethereum",
            symbol: "ETH",
            targetPrice: 4000,
            condition: "below",
          })
        }
      >
        <Text>Add Alert</Text>
      </TouchableOpacity>
    </View>
  );
}

describe("Context - AlertProvider & useAlerts", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("deve inicializar com 0 alertas quando o AsyncStorage estiver vazio", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByTestId } = await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(getByTestId("alert-count").props.children).toBe(0);
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith("cryptoAlerts");
  });

  it("deve hidratar os alertas persistidos no AsyncStorage", async () => {
    const savedAlerts = [
      {
        id: "alert-1",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 70000,
        condition: "above" as const,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(savedAlerts)
    );

    const { getByTestId, findByText } = await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    expect(await findByText("Bitcoin")).toBeTruthy();
    expect(getByTestId("alert-count").props.children).toBe(1);
  });

  it("deve adicionar um novo alerta e persistir no AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByTestId, findByText } = await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(getByTestId("alert-count").props.children).toBe(0);
    });

    fireEvent.press(getByTestId("add-alert-btn"));

    expect(await findByText("Ethereum")).toBeTruthy();
    expect(getByTestId("alert-count").props.children).toBe(1);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "cryptoAlerts",
        expect.stringContaining("Ethereum")
      );
    });
  });

  it("deve remover um alerta ao acionar deleteAlert e atualizar a persistência", async () => {
    const initialAlerts = [
      {
        id: "alert-1",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 68000,
        condition: "above" as const,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(initialAlerts)
    );

    const { getByTestId, queryByText, findByText } = await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    expect(await findByText("Bitcoin")).toBeTruthy();

    fireEvent.press(getByTestId("delete-btn-alert-1"));

    await waitFor(() => {
      expect(queryByText("Bitcoin")).toBeNull();
      expect(getByTestId("alert-count").props.children).toBe(0);
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("cryptoAlerts", "[]");
    });
  });

  it("deve lançar erro se useAlerts for chamado fora do AlertProvider", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(async () => {
      await render(<TestConsumer />);
    }).rejects.toThrow("useAlerts must be used within AlertProvider");

    consoleSpy.mockRestore();
  });
});
