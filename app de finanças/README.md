# 💰 FinanceAI - Assistente Financeiro Inteligente

Aplicativo de finanças pessoais com design inspirado na Apple, controle por voz estilo Jarvis e integração automática com bancos brasileiros.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## ✨ Recursos

- 🎤 **Controle por Voz**: Fale suas transações naturalmente ("gastei 50 reais com almoço")
- 🏦 **Integração Bancária**: Conecte bancos reais via Open Banking (Pluggy)
- 💰 **Gestão Financeira**: Acompanhe receitas, despesas e saldo total
- 📊 **Visualização Mensal**: Navegue entre meses e veja histórico completo
- 🎨 **Design Minimalista**: Interface limpa inspirada na Apple
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 💾 **Armazenamento Local**: Dados salvos no navegador
- 🗣️ **Resposta por Voz**: A IA confirma suas transações falando

## 🚀 Como Usar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/financeai.git
cd financeai
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as credenciais do Pluggy:
   - Crie conta em: https://dashboard.pluggy.ai/signup
   - Copie suas credenciais (Client ID e Secret)
   - Renomeie `.env.example` para `.env`
   - Cole suas credenciais no arquivo `.env`

4. Inicie o servidor:
```bash
npm start
```

5. Abra no navegador:
```
http://localhost:3000
```

### Uso Básico

1. **Controle por Voz**: Clique no microfone e fale
   - "Gastei 50 reais com almoço"
   - "Recebi 3000 reais de salário"
   - "Paguei 150 reais em supermercado"

2. **Conectar Banco**: Clique em "🏦 Conectar Banco"
   - Escolha seu banco
   - Faça login (use sandbox para testes)
   - Transações sincronizadas automaticamente!

3. **Navegação Mensal**: Use as setas ← → para ver gastos de outros meses

## 🏦 Bancos Suportados

- Nubank
- Inter
- Itaú
- Bradesco
- Santander
- Banco do Brasil
- Caixa
- +200 instituições financeiras

## 🧪 Modo Teste (Sandbox)

Para testar sem conectar banco real:
- Usuário: `user-ok`
- Senha: `password-ok`

## 📋 Requisitos

- Node.js >= 14.0.0
- Navegador moderno (Chrome, Edge, Firefox)
- Conta Pluggy (gratuita)

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **API**: Pluggy (Open Banking)
- **Reconhecimento de Voz**: Web Speech API
- **Armazenamento**: LocalStorage

## 📦 Estrutura do Projeto

```
financeai/
├── index.html              # Interface principal
├── styles.css              # Estilos (design Apple-like)
├── script.js               # Lógica do app e voz
├── bank-integration.js     # Integração bancária
├── server.js               # Backend API
├── package.json            # Dependências
├── .env.example            # Exemplo de variáveis
├── .gitignore              # Arquivos ignorados
├── SETUP.md                # Guia de configuração
└── README.md               # Este arquivo
```

## 🔒 Segurança

- Credenciais nunca são commitadas (`.env` no `.gitignore`)
- Comunicação via HTTPS com APIs bancárias
- Dados armazenados localmente no navegador
- Sem armazenamento de senhas bancárias

## 💡 Comandos de Voz Suportados

**Despesas:**
- "Gastei [valor] com/em/de [descrição]"
- "Paguei [valor] com/em/de [descrição]"
- "Comprei [valor] com/em/de [descrição]"

**Receitas:**
- "Recebi [valor] de [descrição]"
- "Ganhei [valor] com [descrição]"

## 📝 Licença

MIT License - veja LICENSE para detalhes

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

## 📧 Contato

Dúvidas? Abra uma issue no GitHub!

---

Feito com ❤️ usando tecnologias brasileiras
