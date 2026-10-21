import {
  cryptocurrencies,
  fiatCurrencies,
  fetchCryptocurrenciesFromApi,
} from "../cryptoData";

describe("Data - cryptoData", () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.EXPO_PUBLIC_COINGECKO_API_KEY = originalEnv;
  });

  it("deve exportar uma lista inicial válida de criptomoedas e moedas fiduciárias", () => {
    expect(cryptocurrencies.length).toBeGreaterThan(0);
    expect(cryptocurrencies[0]).toHaveProperty("id", "bitcoin");
    expect(cryptocurrencies[0]).toHaveProperty("symbol", "BTC");

    expect(fiatCurrencies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "USD", rate: 1 }),
        expect.objectContaining({ code: "BRL" }),
      ])
    );
  });

  it("deve buscar criptomoedas com sucesso da API e mapear campos corretamente", async () => {
    const mockApiResponse = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        current_price: 65000,
        price_change_percentage_24h: 3.5,
        image: "https://example.com/btc.png",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "eth",
        current_price: 3500,
        price_change_percentage_24h: null,
        image: "https://example.com/eth.png",
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await fetchCryptocurrenciesFromApi();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 65000,
      change24h: 3.5,
      image: "https://example.com/btc.png",
    });
    // Verifica se null em change24h foi normalizado para 0
    expect(result[1].change24h).toBe(0);
    expect(result[1].symbol).toBe("ETH");
  });

  it("deve incluir o header da chave da CoinGecko quando a variável de ambiente estiver definida", async () => {
    process.env.EXPO_PUBLIC_COINGECKO_API_KEY = "test-api-key-123";

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await fetchCryptocurrenciesFromApi();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.coingecko.com/api/v3/coins/markets"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          "x-cg-demo-api-key": "test-api-key-123",
        }),
      })
    );
  });

  it("não deve incluir o header da chave da CoinGecko quando a variável não estiver definida", async () => {
    delete process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await fetchCryptocurrenciesFromApi();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.coingecko.com/api/v3/coins/markets"),
      expect.objectContaining({
        headers: {
          Accept: "application/json",
        },
      })
    );
  });

  it("deve lançar erro quando a resposta HTTP não for bem-sucedida", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
    });

    await expect(fetchCryptocurrenciesFromApi()).rejects.toThrow(
      "Failed to fetch cryptocurrencies: 429"
    );
  });

  it("deve propagar erro quando houver falha de rede no fetch", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network failure"));

    await expect(fetchCryptocurrenciesFromApi()).rejects.toThrow("Network failure");
  });
});
