# Crypto Alert 📱🔔

Aplicativo em React Native e Expo para acompanhamento de cotações em tempo real, conversão de moedas e configuração de alertas de preços para criptomoedas com persistência local.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** React Native (0.83.4) com Expo (SDK 55) e Expo Router
* **Linguagem:** TypeScript (5.9.2)
* **Estado Global e Persistência:** React Context API + `@react-native-async-storage/async-storage`
* **Testes:** Jest 29 + `jest-expo` + `@testing-library/react-native` (v14) + `test-renderer`

---

## 🚀 Instalação e Execução

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Aplicativo
```bash
npm run start
# ou
npm run android
npm run ios
npm run web
```

---

## 🧪 Suíte de Testes Automatizados

O projeto conta com uma arquitetura de testes abrangente cobrindo funções utilitárias puras, serviços de dados e integração com API externa simulada, regras de negócio em custom hooks, componentes visuais com acessibilidade e fluxos completos de telas.

### Comandos de Teste

| Comando | Descrição |
| :--- | :--- |
| `npm run test:ci` | Executa todos os testes uma única vez (ideal para CI/CD e validação local rápida). |
| `npm test` | Executa os testes no modo contínuo / interativo (`jest --watchAll`). |
| `npm run test:coverage` | Executa todos os testes e gera o relatório completo de cobertura de código no terminal e em HTML. |

---

## 📂 Estrutura e Explicação dos Testes

### 1. Testes Unitários
* **Formatadores e Funções Puras** (`src/utils/__tests__/index.test.ts`):
  * Testa `formatPrice` com valores normais, arredondamentos decimais personalizados, valores negativos, limites (`0`, números grandes) e entradas inválidas (`NaN`, `Infinity`).
  * Testa `formatChange` com variações positivas (`+2.45%`), neutras (`+0.00%`), negativas (`-1.23%`) e arredondamentos.
* **Serviços de Dados e Consumo de API** (`src/data/__tests__/cryptoData.test.ts`):
  * Testa `fetchCryptocurrenciesFromApi` com mock de `global.fetch` (status 200, mapeamento de campos, normalização de símbolos para maiúsculas e fallback de variação nula para `0`).
  * Testa inclusão e omissão de headers de chave de API (`x-cg-demo-api-key`).
  * Testa tratamento de erros HTTP (ex.: 429) e falhas de rede sem acessar a rede externa.
* **Contexto e Persistência** (`src/context/AlertProvider/__tests__/useAlertProvider.test.tsx`):
  * Testa a inicialização e hidratação assíncrona de alertas a partir do `AsyncStorage`.
  * Testa as regras de negócio de `addAlert` (geração de ID único e ISO date `createdAt`) e `deleteAlert`.
  * Testa persistência das alterações no `AsyncStorage` sob a chave `cryptoAlerts`.
  * Testa proteção contra o uso de `useAlerts` fora de `AlertProvider`.

### 2. Testes de Componentes e Hooks
* **Componentes Visuais:**
  * `PrimaryButton` (`src/components/PrimaryButton/__tests__/PrimaryButton.test.tsx`): Renderização com acessibilidade (`accessibilityRole="button"`), disparo de evento `onPress`, bloqueio de clique quando `disabled={true}` e renderização de ícones.
  * `AlertCard` (`src/components/AlertCard/__tests__/AlertCard.test.tsx`): Exibição dos dados do alerta, formatação monetária, variantes visual de condição (`above`/`below`) e botão de exclusão acessível.
  * `CryptoCard` (`src/components/CryptoCard/__tests__/CryptoCard.test.tsx`): Exibição do ativo, preço formatado e variação de 24h positiva/negativa.
* **Custom Hooks Reais:**
  * `useCryptoListScreen` (`src/screens/CryptoListScreen/__tests__/useCryptoListScreen.test.tsx`): Gerenciamento dos estados assíncronos (`loading`, `idle`, `empty`, `error`), retenção dos dados estáticos como fallback e funcionalidade de retentativa (`handleRetry`).
  * `useConversionScreen` (`src/screens/ConversionScreen/__tests__/useConversionScreen.test.tsx`): Validação de entradas (valores numéricos e positivos), cálculo matemático de conversão com cotação e taxa fiat, e tratamento de erros.

### 3. Teste de Fluxo Completo (Integração)
* **Fluxo de Gestão de Alertas** (`src/screens/__tests__/AlertFlowIntegration.test.tsx`):
  * Valida o fluxo de visualização da lista vazia (`EmptyState`) e navegação para cadastro.
  * Valida as restrições do formulário na `CreateAlertScreen` (bloqueio de submissão enquanto inválido).
  * Valida o carregamento dos alertas persistidos, renderização dos cards com valores formatados e acionamento da deleção com atualização da persistência.

---

## 📊 Relatório Real de Cobertura de Código

Executado através de `npm run test:coverage`:

```
-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   77.77 |    54.77 |      70 |   78.81 |                   
 components/AlertCard          |     100 |      100 |     100 |     100 |                   
  AlertCard.tsx                |     100 |      100 |     100 |     100 |                   
  useAlertCard.ts              |     100 |      100 |     100 |     100 |                   
 components/ConditionOptionRow |   83.33 |      100 |   66.66 |   83.33 |                   
  ConditionOptionRow.tsx       |     100 |      100 |     100 |     100 |                   
  useConditionOptionRow.ts     |   66.66 |      100 |      50 |   66.66 | 10                
 components/CryptoCard         |    62.5 |    33.33 |   42.85 |   71.42 |                   
  CryptoCard.tsx               |   66.66 |    41.17 |      50 |   66.66 | 74                
  useCryptoCard.ts             |   61.53 |        0 |      40 |   72.72 | 12,21-22          
 components/EmptyState         |     100 |       50 |     100 |     100 |                   
  EmptyState.tsx               |     100 |       50 |     100 |     100 | 26-29             
  useEmptyState.ts             |     100 |      100 |     100 |     100 |                   
 components/PrimaryButton      |     100 |    76.92 |     100 |     100 |                   
  PrimaryButton.tsx            |     100 |    81.81 |     100 |     100 | 33                
  usePrimaryButton.ts          |     100 |       50 |     100 |     100 | 10                
 components/ScreenHeader       |      80 |       50 |   66.66 |      80 |                   
  ScreenHeader.tsx             |     100 |       50 |     100 |     100 | 17                
  useScreenHeader.ts           |   66.66 |      100 |      50 |   66.66 | 9                 
 components/SelectField        |   61.11 |    23.07 |      40 |   66.66 |                   
  SelectField.tsx              |      40 |    22.22 |      25 |      40 | 72-75             
  useSelectField.ts            |   69.23 |       25 |      50 |      80 | 34-35             
 context/AlertProvider         |     100 |       90 |   93.33 |     100 |                   
  AlertProvider.tsx            |     100 |      100 |     100 |     100 |                   
  useAlertProvider.ts          |     100 |       90 |   92.85 |     100 | 49                
 data                          |     100 |      100 |     100 |     100 |                   
  cryptoData.ts                |     100 |      100 |     100 |     100 |                   
 screens/ConversionScreen      |   88.88 |    66.66 |   91.66 |   87.09 |                   
  useConversionScreen.ts       |   94.11 |    85.71 |     100 |    93.1 | 21-22             
 screens/CreateAlertScreen     |   45.45 |       15 |      50 |   48.27 |                   
  CreateAlertScreen.tsx        |     100 |       50 |     100 |     100 | 42-62             
  useCreateAlertScreen.ts      |   41.93 |     6.25 |   42.85 |   44.44 | 17-30,34-46,50    
 screens/CryptoListScreen      |    82.6 |    33.33 |   57.14 |    82.6 |                   
  useCryptoListScreen.ts       |     100 |      100 |     100 |     100 |                   
 screens/PriceAlertsScreen     |     100 |      100 |     100 |     100 |                   
  PriceAlertsScreen.tsx        |     100 |      100 |     100 |     100 |                   
  usePriceAlertsScreen.ts      |     100 |      100 |     100 |     100 |                   
 utils                         |     100 |      100 |     100 |     100 |                   
  index.ts                     |     100 |      100 |     100 |     100 |                   
-------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 9 passed, 9 total
Tests:       43 passed, 43 total
Snapshots:   0 total
```

### Resumo das Métricas
* **Declarações (Statements):** 77.77% (Meta: >= 50%) ✅
* **Ramificações (Branches):** 54.77% (Meta: >= 50%) ✅
* **Funções (Functions):** 70.00% (Meta: >= 50%) ✅
* **Linhas (Lines):** 78.81% (Meta: >= 50%) ✅

### Localização do Relatório HTML
O relatório interativo completo em HTML é gerado automaticamente na pasta:
```
coverage/lcov-report/index.html
```
Para visualizar no navegador:
* Abra o arquivo `coverage/lcov-report/index.html` em qualquer navegador web.
