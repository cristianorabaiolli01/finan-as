class BankIntegration {
    constructor() {
        this.serverUrl = 'http://localhost:3000';
        this.connectedAccounts = JSON.parse(localStorage.getItem('connectedAccounts')) || [];
    }

    async connectBank() {
        try {
            // Obter token de conexão
            const response = await fetch(`${this.serverUrl}/api/create-connect-token`, {
                method: 'POST'
            });
            const { accessToken } = await response.json();

            // Abrir widget Pluggy
            const pluggyConnect = new window.PluggyConnect({
                connectToken: accessToken,
                includeSandbox: true, // Para testes
                onSuccess: (itemData) => {
                    console.log('Banco conectado:', itemData);
                    this.handleConnectionSuccess(itemData);
                },
                onError: (error) => {
                    console.error('Erro na conexão:', error);
                    alert('Erro ao conectar banco. Tente novamente.');
                }
            });

            pluggyConnect.init();
        } catch (error) {
            console.error('Erro ao iniciar conexão:', error);
            alert('Erro ao conectar com servidor.');
        }
    }

    async handleConnectionSuccess(itemData) {
        try {
            // Buscar contas do item conectado
            const response = await fetch(`${this.serverUrl}/api/accounts/${itemData.item.id}`);
            const accounts = await response.json();

            // Salvar contas
            accounts.results.forEach(account => {
                this.connectedAccounts.push({
                    itemId: itemData.item.id,
                    accountId: account.id,
                    bankName: itemData.item.connector.name,
                    accountType: account.type,
                    balance: account.balance,
                    currency: account.currencyCode,
                    lastSync: new Date().toISOString()
                });
            });

            localStorage.setItem('connectedAccounts', JSON.stringify(this.connectedAccounts));
            
            // Atualizar UI
            this.displayConnectedAccounts();
            await this.syncTransactions();
            
            alert(`${itemData.item.connector.name} conectado com sucesso!`);
        } catch (error) {
            console.error('Erro ao processar conexão:', error);
        }
    }

    async syncTransactions() {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);

        for (const account of this.connectedAccounts) {
            try {
                const response = await fetch(
                    `${this.serverUrl}/api/transactions/${account.accountId}?from=${threeMonthsAgo.toISOString()}&to=${today.toISOString()}`
                );
                const data = await response.json();

                // Converter transações Pluggy para formato do app
                data.results.forEach(transaction => {
                    const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
                    
                    // Evitar duplicatas
                    const exists = existingTransactions.some(t => t.externalId === transaction.id);
                    if (!exists) {
                        existingTransactions.push({
                            id: Date.now() + Math.random(),
                            externalId: transaction.id,
                            type: transaction.amount < 0 ? 'expense' : 'income',
                            amount: Math.abs(transaction.amount),
                            description: transaction.description || 'Transação bancária',
                            date: new Date(transaction.date).toLocaleDateString('pt-BR'),
                            timestamp: new Date(transaction.date).getTime(),
                            source: 'bank',
                            bankName: account.bankName
                        });
                    }
                    
                    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
                });

                account.lastSync = new Date().toISOString();
            } catch (error) {
                console.error(`Erro ao sincronizar ${account.bankName}:`, error);
            }
        }

        localStorage.setItem('connectedAccounts', JSON.stringify(this.connectedAccounts));
        
        // Atualizar UI do app principal
        if (window.app) {
            window.app.updateUI();
        }
    }

    displayConnectedAccounts() {
        const container = document.getElementById('connectedBanksList');
        if (!container) return;

        if (this.connectedAccounts.length === 0) {
            container.innerHTML = '<p class="empty-state">Nenhum banco conectado</p>';
            return;
        }

        container.innerHTML = this.connectedAccounts.map(account => `
            <div class="bank-account-card">
                <div class="bank-info">
                    <h4>${account.bankName}</h4>
                    <p>${account.accountType}</p>
                </div>
                <div class="bank-balance">
                    <p class="balance-label">Saldo</p>
                    <p class="balance-value">${this.formatCurrency(account.balance)}</p>
                </div>
                <button class="sync-btn" onclick="bankIntegration.syncAccount('${account.accountId}')">
                    🔄 Sincronizar
                </button>
            </div>
        `).join('');
    }

    async syncAccount(accountId) {
        const account = this.connectedAccounts.find(a => a.accountId === accountId);
        if (!account) return;

        alert('Sincronizando...');
        await this.syncTransactions();
        alert('Sincronização concluída!');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    getTotalBankBalance() {
        return this.connectedAccounts.reduce((sum, account) => sum + account.balance, 0);
    }
}

// Instância global
const bankIntegration = new BankIntegration();
