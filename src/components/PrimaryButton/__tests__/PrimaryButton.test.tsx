import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { PrimaryButton } from "../PrimaryButton";

describe("Component - PrimaryButton", () => {
  it("deve renderizar o label do botão corretamente com papel acessível de botão", async () => {
    const handlePress = jest.fn();
    const { getByRole, getByText } = await render(
      <PrimaryButton label="Salvar Alerta" onPress={handlePress} />
    );

    const button = getByRole("button");
    expect(button).toBeTruthy();
    expect(getByText("Salvar Alerta")).toBeTruthy();
  });

  it("deve disparar onPress quando o botão for pressionado", async () => {
    const handlePress = jest.fn();
    const { getByRole } = await render(
      <PrimaryButton label="Confirmar" onPress={handlePress} />
    );

    fireEvent.press(getByRole("button"));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("não deve disparar onPress quando estiver desabilitado", async () => {
    const handlePress = jest.fn();
    const { getByRole } = await render(
      <PrimaryButton label="Desabilitado" onPress={handlePress} disabled />
    );

    const button = getByRole("button");
    expect(button.props.accessibilityState).toEqual({ disabled: true });

    fireEvent.press(button);
    expect(handlePress).not.toHaveBeenCalled();
  });

  it("deve renderizar o ícone à esquerda quando fornecido", async () => {
    const { getByText } = await render(
      <PrimaryButton
        label="Com Ícone"
        onPress={jest.fn()}
        leftIcon={<Text>🚀</Text>}
      />
    );

    expect(getByText("🚀")).toBeTruthy();
    expect(getByText("Com Ícone")).toBeTruthy();
  });
});
