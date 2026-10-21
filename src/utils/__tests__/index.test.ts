import { formatChange, formatPrice } from "../index";

describe("Utils - formatPrice", () => {
  it("deve formatar números comuns com 2 casas decimais no padrão americano", () => {
    expect(formatPrice(1234.56)).toBe("1,234.56");
    expect(formatPrice(100)).toBe("100.00");
  });

  it("deve respeitar a quantidade de casas decimais personalizada", () => {
    expect(formatPrice(1234.5678, 4)).toBe("1,234.5678");
    expect(formatPrice(45.5, 0)).toBe("46");
    expect(formatPrice(0.123, 1)).toBe("0.1");
  });

  it("deve lidar corretamente com o valor zero", () => {
    expect(formatPrice(0)).toBe("0.00");
    expect(formatPrice(0, 4)).toBe("0.0000");
  });

  it("deve formatar valores negativos corretamente", () => {
    expect(formatPrice(-50.25)).toBe("-50.25");
    expect(formatPrice(-1500.8)).toBe("-1,500.80");
  });

  it("deve lidar com valores grandes e frações muito pequenas", () => {
    expect(formatPrice(1000000)).toBe("1,000,000.00");
    expect(formatPrice(0.00045, 5)).toBe("0.00045");
  });

  it("deve lidar com valores limites como NaN e Infinity", () => {
    expect(formatPrice(NaN)).toBe("NaN");
    expect(formatPrice(Infinity)).toBe("∞");
  });
});

describe("Utils - formatChange", () => {
  it("deve adicionar o prefixo '+' e '%' para variações positivas", () => {
    expect(formatChange(2.45)).toBe("+2.45%");
    expect(formatChange(10)).toBe("+10.00%");
  });

  it("deve adicionar o prefixo '+' para zero", () => {
    expect(formatChange(0)).toBe("+0.00%");
  });

  it("deve manter o sinal negativo para variações negativas", () => {
    expect(formatChange(-1.23)).toBe("-1.23%");
    expect(formatChange(-0.5)).toBe("-0.50%");
  });

  it("deve arredondar para duas casas decimais conforme toFixed", () => {
    expect(formatChange(3.14159)).toBe("+3.14%");
    expect(formatChange(-2.999)).toBe("-3.00%");
  });

  it("deve lidar com entradas inválidas como NaN", () => {
    expect(formatChange(NaN)).toBe("NaN%");
  });
});
