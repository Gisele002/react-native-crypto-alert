import { renderHook, waitFor } from "@testing-library/react-native";
import { useConversionScreen } from "../useConversionScreen";
import * as cryptoDataModule from "@data/cryptoData";

describe("Screen Hook - useConversionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve inicializar com valores padrão e opções de cripto e fiat", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    expect(result.current.selectedCrypto).toBe("bitcoin");
    expect(result.current.selectedFiat).toBe("USD");
    expect(result.current.formattedResult).toBeNull();
    expect(result.current.showPlaceholder).toBe(true);
    expect(result.current.showInvalid).toBe(false);
    expect(result.current.cryptoOptions.length).toBeGreaterThan(0);
    expect(result.current.fiatOptions.length).toBeGreaterThan(0);
  });

  it("deve calcular a conversão corretamente quando informado montante válido", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    result.current.setAmount("2");

    await waitFor(() => {
      // 2 * 67999.5 * 1 = $135,999.00
      expect(result.current.formattedResult).toBe("$135,999.00");
      expect(result.current.showPlaceholder).toBe(false);
      expect(result.current.showInvalid).toBe(false);
    });
  });

  it("deve calcular conversão para BRL corretamente", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    result.current.setSelectedFiat("BRL");
    result.current.setAmount("1");

    await waitFor(() => {
      // 1 * 67999.5 * 5.12 = 348157.44
      expect(result.current.formattedResult).toContain("R$");
    });
  });

  it("deve sinalizar entrada inválida para valores negativos ou não numéricos", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    result.current.setAmount("-5");

    await waitFor(() => {
      expect(result.current.formattedResult).toBeNull();
      expect(result.current.showInvalid).toBe(true);
    });

    result.current.setAmount("abc");

    await waitFor(() => {
      expect(result.current.formattedResult).toBeNull();
      expect(result.current.showInvalid).toBe(true);
    });
  });

  it("deve carregar dados da API ou aplicar fallback em caso de falha", async () => {
    jest
      .spyOn(cryptoDataModule, "fetchCryptocurrenciesFromApi")
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = await renderHook(() => useConversionScreen());

    await waitFor(() => {
      expect(result.current.cryptoOptions.length).toBeGreaterThan(0);
    });
  });
});
