# Setup - Integração Bancária com Pluggy

## Passo 1: Criar conta no Pluggy

1. Acesse: https://dashboard.pluggy.ai/signup
2. Crie sua conta gratuita
3. Após login, vá em "API Keys"
4. Copie seu `Client ID` e `Client Secret`

## Passo 2: Configurar variáveis de ambiente

1. Renomeie `.env.example` para `.env`
2. Cole suas credenciais:
```
PLUGGY_CLIENT_ID=seu_client_id_aqui
PLUGGY_CLIENT_SECRET=seu_client_secret_aqui
PORT=3000
```

## Passo 3: Instalar dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

## Passo 4: Iniciar o servidor

```bash
npm start
```

O servidor vai rodar em `http://localhost:3000`

## Passo 5: Usar o app

1. Abra `http://localhost:3000` no navegador
2. Clique em "🏦 Conectar Banco"
3. Escolha um banco (use Sandbox para testes)
4. Faça login com credenciais de teste
5. Suas transações serão sincronizadas automaticamente!

## Credenciais de Teste (Sandbox)

Para testar sem conectar banco real, use:
- Usuário: `user-ok`
- Senha: `password-ok`

## Bancos Suportados

- Nubank
- Inter
- Itaú
- Bradesco
- Santander
- Banco do Brasil
- Caixa
- E mais de 200 instituições!

## Troubleshooting

**Erro "Cannot find module"**: Execute `npm install`

**Erro de CORS**: Certifique-se que o servidor está rodando

**Banco não conecta**: Verifique suas credenciais no Pluggy Dashboard

## Custos

- Plano gratuito: 50 conexões/mês
- Ideal para uso pessoal
- Veja planos: https://pluggy.ai/pricing
