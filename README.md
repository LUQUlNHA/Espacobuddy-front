
# 📱 EspacoBuddy — App de Alimentação Automatizada

Aplicativo móvel desenvolvido em **React Native** com autenticação via **Keycloak**, que permite aos tutores de animais de estimação gerenciar rotinas de alimentação, dispositivos emparelhados e notificações em tempo real.

## 🚀 Funcionalidades

- Login com Keycloak (fluxo ROPC + WebView)
- Cadastro de novos usuários
- Criação, edição e listagem de rotinas de alimentação
- Emparelhamento de dispositivos alimentadores
- Alertas de alimentação e pouca ração
- Interface mobile moderna, responsiva e acessível

---

## 🧱 Arquitetura & Organização

### 📂 Estrutura de Pastas

```
/assets           # Imagens, fontes e ícones
/app              # Telas principais do app
/utils            # Serviços auxiliares (Keycloak, API, SecureStore)
```

### 🔐 Autenticação

A autenticação é feita com **Keycloak**, utilizando dois fluxos:

- `Resource Owner Password Credentials (ROPC)` para login programático com email/senha
- `WebView` para recuperação de conta e gerenciamento de perfil

Tokens são armazenados com segurança via [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/).

---

## 🧠 Padrões de Projeto Utilizados

O código segue **boas práticas de desenvolvimento** com foco em manutenibilidade, separação de responsabilidades e consistência.

### ✅ SOLID

- **S - Single Responsibility Principle**: Cada componente/tela lida com uma única responsabilidade (ex: `Login.tsx` só cuida da autenticação).
- **O - Open/Closed Principle**: Componentes e funções foram pensados para serem estendidos sem modificação.
- **L - Liskov Substitution Principle**: Funções e props de componentes respeitam seus tipos base.
- **I - Interface Segregation**: Não há sobrecarga de props em componentes simples.
- **D - Dependency Inversion**: Abstrações como `keycloak.ts` e `database.ts` desacoplam a lógica do front-end das chamadas externas.

### ⚛️ Atomic Design (opcional)

Para projetos maiores, recomenda-se dividir componentes em:

- `Atoms` (botões, inputs, textos)
- `Molecules` (formulários, sliders)
- `Organisms` (seções completas da UI)

---

## 🧪 Tecnologias

| Tecnologia        | Descrição                       |
|-------------------|---------------------------------|
| React Native      | Framework mobile principal      |
| Expo Router       | Navegação baseada em arquivos   |
| Keycloak          | Autenticação e autorização      |
| PostgreSQL (API)  | Persistência das rotinas        |
| MQTT (Broker)     | Comunicação com alimentadores   |

---

## 📝 Considerações

Este projeto foi idealizado para funcionar com backend próprio (Flask/PostgreSQL) e um serviço MQTT que controla os alimentadores físicos conectados ao sistema.

Caso deseje extender este app, é possível integrar:

- Notificações push com Expo
- Histórico de alimentação por pet
- Controle de múltiplos usuários ou cuidadores

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

