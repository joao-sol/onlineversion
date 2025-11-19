
# Agenda Gamer

Aplicação mobile para gerenciar sua coleção de jogos e organizar sessões de gameplay.

## Sobre o Projeto

**Agenda Gamer** é um app desenvolvido com Expo e React Native que permite:
- Agendar sessões de gameplay
- Acompanhar suas sessões agendadas
- Gerenciar seu tempo dedicado aos jogos
- Salvar fotos de recordação das suas sessões após finalizá-las

## Como Rodar a Aplicação

### Pré-requisitos
- Node.js instalado
- Yarn instalado
- Expo Go instalado no seu dispositivo móvel (iOS/Android)
- PocketBase instalado e rodando um banco com as collections existentes no projeto
- Provavelmente o servidor estará desligado, então altere o endereço do banco de dados em lib.pb.ts para: export const POCKETBASE_URL = process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://localhost:8090/'

### Instalação e Execução

1. Clone o repositório:
```bash
git clone [https://github.com/VitorThorvi/tsi34a-availiacao-01
cd 34a-avaliacao-01](https://github.com/joao-sol/onlineversion)
```

2. Instale as dependências:
``` bash
   yarn install
```

3. Inicie o PocketBase:
``` bash
   ./pocketbase serve --http 0.0.0.0:3000
```

4. Inicie o servidor Expo:
``` bash
yarn start
```
## Tecnologias Utilizadas
* Expo (v54.0.12)
* React Native (v0.81.4)
* TypeScript (v5.9.2)
* Expo Router (v6.0.10) - Navegação
* React Native Action Sheet - Menus contextuais
* PocketBase - Banco de dados NoSQL

## Screenshots
![Screenshot 2025-10-08 at 18.25.57.png](screenshots/Screenshot%202025-10-08%20at%2018.25.57.png)
![Screenshot 2025-10-08 at 18.26.05.png](screenshots/Screenshot%202025-10-08%20at%2018.26.05.png)
![Screenshot 2025-10-08 at 18.26.10.png](screenshots/Screenshot%202025-10-08%20at%2018.26.10.png)
![Screenshot 2025-10-08 at 18.26.19.png](screenshots/Screenshot%202025-10-08%20at%2018.26.19.png)
---
Nota: Este é um projeto acadêmico desenvolvido para avaliação da disciplina TSI34A da UTFPR-Guarapuava
