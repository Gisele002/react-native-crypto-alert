import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Button, Text, View } from "react-native";
import { useCryptoListScreen } from "../useCryptoListScreen";
import * as cryptoDataModule from "@data/cryptoData";

function HookConsumer() {
  const { loadingState, cryptocurrencies, handleRetry } = useCryptoListScreen();

  return (
    <View>
      <Text accessibilityLabel="Estado de Carregamento">{loadingState}</Text>
      <Text accessibilityLabel="Total de Criptos">{cryptocurrencies.length}</Text>
      {cryptocurrencies.length > 0 ? (
        <Text accessibilityLabel="Primeira Cripto">{cryptocurrencies[0].name}</Text>
      ) : null}
      <Button title="Tentar Novamente" onPress={handleRetry} />
    </View>
  );
}

describe("Hook - useCryptoListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve carregar dados com sucesso, transicionando de loading para idle", async () => {
    const mockCryptos = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 67000,
        change24h: 2.5,
      },
    ];

    jest
      .spyOn(cryptoDataModule, "fetchCryptocurrenciesFromApi")
      .mockResolvedValueOnce(mockCryptos);

    const { getByLabelText } = await render(<HookConsumer />);

    // Aguarda atualização assíncrona com waitFor
    await waitFor(() => {
      expect(getByLabelText("Estado de Carregamento").props.children).toBe("idle");
      expect(getByLabelText("Total de Criptos").props.children).toBe(1);
      expect(getByLabelText("Primeira Cripto").props.children).toBe("Bitcoin");
    });
  });

  it("deve transicionar para o estado empty quando a API retornar lista vazia", async () => {
    jest
      .spyOn(cryptoDataModule, "fetchCryptocurrenciesFromApi")
      .mockResolvedValueOnce([]);

    const { getByLabelText } = await render(<HookConsumer />);

    await waitFor(() => {
      expect(getByLabelText("Estado de Carregamento").props.children).toBe("empty");
      expect(getByLabelText("Total de Criptos").props.children).toBe(0);
    });
  });

  it("deve tratar erro na API mantendo os dados de fallback e definindo estado como error", async () => {
    jest
      .spyOn(cryptoDataModule, "fetchCryptocurrenciesFromApi")
      .mockRejectedValueOnce(new Error("Falha na API CoinGecko"));

    const { getByLabelText } = await render(<HookConsumer />);

    await waitFor(() => {
      expect(getByLabelText("Estado de Carregamento").props.children).toBe("error");
      // Mantém fallbackCryptos que possui 8 moedas estáticas
      expect(Number(getByLabelText("Total de Criptos").props.children)).toBeGreaterThan(0);
    });
  });

  it("deve permitir retentativa através de handleRetry", async () => {
    const fetchSpy = jest
      .spyOn(cryptoDataModule, "fetchCryptocurrenciesFromApi")
      .mockRejectedValueOnce(new Error("Erro temporário"))
      .mockResolvedValueOnce([
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price: 3500,
          change24h: 1.2,
        },
      ]);

    const { getByLabelText, getByRole } = await render(<HookConsumer />);

    await waitFor(() => {
      expect(getByLabelText("Estado de Carregamento").props.children).toBe("error");
    });

    const retryButton = getByRole("button", { name: "Tentar Novamente" });
    fireEvent.press(retryButton);

    await waitFor(() => {
      expect(getByLabelText("Estado de Carregamento").props.children).toBe("idle");
      expect(getByLabelText("Primeira Cripto").props.children).toBe("Ethereum");
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
