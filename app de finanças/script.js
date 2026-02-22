class FinanceAI {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.isListening = false;
        this.recognition = null;
        this.currentMonth = new Date();
        this.initSpeechRecognition();
        this.initEventListeners();
        this.updateUI();
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'pt-BR';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                document.getElementById('voiceCircle').classList.add('active');
                document.getElementById('voiceStatus').textContent = 'Estou ouvindo...';
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('transcript').textContent = `"${transcript}"`;
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Erro no reconhecimento:', event.error);
                this.stopListening();
                document.getElementById('voiceStatus').textContent = 'Erro ao ouvir. Tente novamente.';
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        } else {
            alert('Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.');
        }
    }

    initEventListeners() {
        document.getElementById('voiceCircle').addEventListener('click', () => {
            if (this.isListening) {
                this.recognition.stop();
            } else {
                this.startListening();
            }
        });

        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.updateUI();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.updateUI();
        });
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
        }
    }

    stopListening() {
        this.isListening = false;
        document.getElementById('voiceCircle').classList.remove('active');
        document.getElementById('voiceStatus').textContent = 'Toque para falar';
    }

    processVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Extrair valores monetários
        const valueMatch = lowerCommand.match(/(\d+(?:[.,]\d+)?)/);
        const value = valueMatch ? parseFloat(valueMatch[1].replace(',', '.')) : null;

        let type = null;
        let description = '';

        // Detectar tipo de transação
        if (lowerCommand.includes('gastei') || lowerCommand.includes('paguei') || 
            lowerCommand.includes('comprei') || lowerCommand.includes('despesa')) {
            type = 'expense';
        } else if (lowerCommand.includes('recebi') || lowerCommand.includes('ganhei') || 
                   lowerCommand.includes('receita') || lowerCommand.includes('salário')) {
            type = 'income';
        }

        // Extrair descrição
        if (lowerCommand.includes('com') || lowerCommand.includes('em') || lowerCommand.includes('de')) {
            const parts = lowerCommand.split(/com|em|de/);
            if (parts.length > 1) {
                description = parts[1].trim();
            }
        }

        if (!description) {
            description = command;
        }

        if (value && type) {
            this.addTransaction(type, value, description);
            this.speak(`Entendido! ${type === 'expense' ? 'Despesa' : 'Receita'} de ${value.toFixed(2)} reais registrada.`);
        } else {
            this.speak('Desculpe, não entendi. Tente dizer algo como: gastei 50 reais com almoço.');
        }

        setTimeout(() => {
            document.getElementById('transcript').textContent = '';
        }, 3000);
    }

    addTransaction(type, amount, description) {
        const transaction = {
            id: Date.now(),
            type,
            amount,
            description: this.capitalizeFirst(description),
            date: new Date().toLocaleDateString('pt-BR'),
            timestamp: Date.now()
        };

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.updateUI();
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    updateUI() {
        const monthTransactions = this.getMonthTransactions();

        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expense;

        document.getElementById('totalBalance').textContent = this.formatCurrency(balance);
        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(expense);

        this.updateMonthDisplay();
        this.renderTransactions();
    }

    getMonthTransactions() {
        const month = this.currentMonth.getMonth();
        const year = this.currentMonth.getFullYear();

        return this.transactions.filter(t => {
            const transactionDate = new Date(t.timestamp);
            return transactionDate.getMonth() === month && 
                   transactionDate.getFullYear() === year;
        });
    }

    updateMonthDisplay() {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const monthName = months[this.currentMonth.getMonth()];
        const year = this.currentMonth.getFullYear();
        const now = new Date();
        
        let displayText = `${monthName} ${year}`;
        if (this.currentMonth.getMonth() === now.getMonth() && 
            this.currentMonth.getFullYear() === now.getFullYear()) {
            displayText = 'Mês Atual';
        }
        
        document.getElementById('currentMonth').textContent = displayText;
    }

    renderTransactions() {
        const list = document.getElementById('transactionsList');
        const monthTransactions = this.getMonthTransactions();
        
        if (monthTransactions.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma transação neste mês.</p>';
            return;
        }

        list.innerHTML = monthTransactions.slice(0, 10).map(t => `
            <div class="transaction-item ${t.type}">
                <div class="transaction-info">
                    <div class="transaction-icon">
                        ${t.type === 'income' ? '↑' : '↓'}
                    </div>
                    <div class="transaction-details">
                        <h4>${t.description}</h4>
                        <p>${t.date}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    ${t.type === 'income' ? '+' : '-'} ${this.formatCurrency(t.amount)}
                </div>
            </div>
        `).join('');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0;
            speechSynthesis.speak(utterance);
        }
    }
}

// Inicializar o app
const app = new FinanceAI();
