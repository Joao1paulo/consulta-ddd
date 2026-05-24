# Consulta DDD 📱

Aplicativo mobile desenvolvido do zero para consulta de localidades brasileiras a partir do código de área (DDD). 

Este projeto foi construído para consolidar na prática os conceitos fundamentais de desenvolvimento mobile, incluindo o gerenciamento de estado, ciclo de vida de componentes e o consumo de APIs RESTful, com uma interface limpa e responsiva baseada no tema escuro do GitHub.

## ✨ Funcionalidades

- **Busca de Localidades:** Consulta dinâmica de Estado (UF) e lista de cidades a partir de um DDD válido (ex: 11, 13).
- **Consumo de API:** Integração assíncrona com o endpoint de DDD da [Brasil API](https://brasilapi.com.br/).
- **Gerenciamento de Estado:** Uso intensivo do hook `useState` para controle de inputs, payloads, status de carregamento e tratamento de erros.
- **Efeitos Colaterais:** Implementação segura do hook `useEffect` para gerenciar os gatilhos das requisições HTTP sem sobrecarregar a rede.
- **Tipagem Rigorosa:** Projeto 100% desenvolvido em TypeScript, utilizando interfaces estritas para o contrato de dados da API (zero uso de `any`).
- **UI/UX:** Interface moderna, minimalista e com feedback visual de *loading* e erros, estilizada com inspiração no *Dark Mode* do GitHub.

## 🚀 Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/):** Framework para o desenvolvimento da interface mobile.
- **[Expo](https://expo.dev/):** Plataforma e toolchain para facilitar o desenvolvimento, build e testes do app.
- **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática ao projeto.
- **Fetch API:** Para as requisições HTTP nativas.

## ⚙️ Como executar o projeto

### Pré-requisitos

Antes de começar, você precisará ter a seguinte ferramenta instalada em sua máquina:
- [Node.js](https://nodejs.org/en/) (Versão LTS recomendada)

### Instalação e Execução

1. Clone este repositório:
   ```bash
   git clone <link-do-seu-repositorio-aqui>
   ```

2. Acesse a pasta do projeto no terminal:
   ```bash
   cd consulta-ddd
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

5. O terminal exibirá um QR Code. Você pode escanear esse código com o aplicativo Expo Go (disponível para Android e iOS) no seu smartphone, ou pressionar `a` para abrir no emulador Android / `i` para o simulador iOS.