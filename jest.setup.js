// jest.setup.js
/* eslint-env jest */

global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock do AsyncStorage oficial
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock do expo-router para permitir testes de navegação e componentes que usam router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useLocalSearchParams: () => ({}),
  Link: "Link",
  Slot: "Slot",
}));

// Mock do @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));
