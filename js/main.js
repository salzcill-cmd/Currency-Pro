// ===== Currency Pro - Main JavaScript =====
// Core logic, state management, and API handlers

// Initialize Alpine.js store
document.addEventListener('alpine:init', () => {
  Alpine.store('app', {
    // State
    rates: {},
    currencies: {},
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    recentCurrencies: JSON.parse(localStorage.getItem('recentCurrencies') || '[]'),
    history: JSON.parse(localStorage.getItem('conversionHistory') || '[]'),
    theme: localStorage.getItem('theme') || 'system',
    isOnline: navigator.onLine,
    isLoading: false,
    lastUpdated: null,
    countdown: 300, // 5 minutes
    
    // Converter state
    fromCurrency: 'USD',
    toCurrency: 'IDR',
    amount: 1,
    convertedAmount: 0,
    rate: 0,
    inverseRate: 0,
    
    // UI state
    showFromDropdown: false,
    showToDropdown: false,
    searchFrom: '',
    searchTo: '',
    showConfetti: false,
    
    // Initialize
    init() {
      this.setupTheme();
      this.loadRates();
      this.startClock();
      this.startCountdown();
      this.setupOnlineListener();
      this.setupKeyboardShortcuts();
    },
    
    // Theme management
    setupTheme() {
      const applyTheme = (theme) => {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      applyTheme(this.theme);
      
      if (this.theme === 'system') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (this.theme === 'system') {
            applyTheme('system');
          }
        });
      }
    },
    
    toggleTheme() {
      const themes = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(this.theme);
      this.theme = themes[(currentIndex + 1) % themes.length];
      localStorage.setItem('theme', this.theme);
      this.setupTheme();
    },
    
    // API Functions with retry
    async fetchWithRetry(url, retries = 3, backoff = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.get(url, { timeout: 10000 });
          return response.data;
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
        }
      }
    },
    
    async loadRates() {
      this.isLoading = true;
      
      try {
        // Try primary API first
        let data;
        try {
          data = await this.fetchWithRetry('https://api.exchangerate-api.com/v4/latest/USD');
          this.rates = data.rates;
          this.lastUpdated = new Date().toISOString();
          this.countdown = 300;
        } catch (e) {
          // Try fallback API
          try {
            const fallbackData = await this.fetchWithRetry('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
            this.rates = fallbackData.usd;
            this.lastUpdated = new Date().toISOString();
            this.countdown = 300;
          } catch (e2) {
            // Try second fallback
            const fallback2 = await this.fetchWithRetry('https://latest.currency-api.pages.dev/v1/currencies/usd.json');
            this.rates = fallback2.usd;
            this.lastUpdated = new Date().toISOString();
            this.countdown = 300;
          }
        }
        
        // Build currencies object with country info
        const currencyCodes = Object.keys(this.rates);
        this.currencies = {};
        
        for (const code of currencyCodes) {
          this.currencies[code] = {
            code: code,
            name: this.getCurrencyName(code),
            flag: `https://flagsapi.com/${this.getCountryCode(code)}/flat/64.png`
          };
        }
        
        this.updateConversion();
      } catch (error) {
        console.error('Failed to load rates:', error);
        Swal.fire({
          icon: 'error',
          title: 'Koneksi Error',
          text: 'Gagal mengambil kurs mata uang. Periksa koneksi internet Anda.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } finally {
        this.isLoading = false;
      }
    },
    
    getCurrencyName(code) {
      const names = {
        'USD': 'Dolar AS', 'IDR': 'Rupiah Indonesia', 'EUR': 'Euro',
        'GBP': 'Poundsterling Inggris', 'JPY': 'Yen Jepang', 'CNY': 'Yuan China',
        'SGD': 'Dolar Singapura', 'MYR': 'Ringgit Malaysia', 'AUD': 'Dolar Australia',
        'KRW': 'Won Korea Selatan', 'INR': 'Rupee India', 'CAD': 'Dolar Kanada',
        'CHF': 'Franc Swiss', 'HKD': 'Dolar Hong Kong', 'TWD': 'Dolar Taiwan',
        'THB': 'Baht Thailand', 'PHP': 'Peso Filipina', 'VND': 'Dong Vietnam',
        'BRL': 'Real Brasil', 'MXN': 'Peso Meksiko', 'ARS': 'Peso Argentina',
        'RUB': 'Rubel Rusia', 'ZAR': 'Rand Afrika Selatan', 'AED': 'Dirham UEA',
        'SAR': 'Riyal Saudi', 'QAR': 'Riyal Qatar', 'EGP': 'Pound Mesir',
        'NGN': 'Naira Nigeria', 'KES': 'Shilling Kenya', 'GHS': 'Cedi Ghana',
        'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'USDT': 'Tether'
      };
      return names[code] || code;
    },
    
    getCountryCode(currencyCode) {
      const mapping = {
        'USD': 'US', 'IDR': 'ID', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP',
        'CNY': 'CN', 'SGD': 'SG', 'MYR': 'MY', 'AUD': 'AU', 'KRW': 'KR',
        'INR': 'IN', 'CAD': 'CA', 'CHF': 'CH', 'HKD': 'HK', 'TWD': 'TW',
        'THB': 'TH', 'PHP': 'PH', 'VND': 'VN', 'BRL': 'BR', 'MXN': 'MX',
        'ARS': 'AR', 'RUB': 'RU', 'ZAR': 'ZA', 'AED': 'AE', 'SAR': 'SA',
        'QAR': 'QA', 'EGP': 'EG', 'NGN': 'NG', 'KES': 'KE', 'GHS': 'GH',
        'BTC': 'UN', 'ETH': 'UN', 'USDT': 'UN'
      };
      return mapping[currencyCode] || 'UN';
    },
    
    // Conversion logic
    updateConversion() {
      if (!this.rates[this.fromCurrency] || !this.rates[this.toCurrency]) return;
      
      const fromRate = this.rates[this.fromCurrency];
      const toRate = this.rates[this.toCurrency];
      
      this.rate = toRate / fromRate;
      this.convertedAmount = this.amount * this.rate;
      this.inverseRate = 1 / this.rate;
      
      // Check for 1 million confetti
      if (this.convertedAmount >= 1000000 && !this.showConfetti) {
        this.triggerConfetti();
      }
    },
    
    swapCurrencies() {
      const temp = this.fromCurrency;
      this.fromCurrency = this.toCurrency;
      this.toCurrency = temp;
      this.updateConversion();
      this.addToRecent(this.fromCurrency);
      this.addToRecent(this.toCurrency);
    },
    
    // Favorites
    toggleFavorite(code) {
      const index = this.favorites.indexOf(code);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(code);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    
    // Recent currencies
    addToRecent(code) {
      this.recentCurrencies = this.recentCurrencies.filter(c => c !== code);
      this.recentCurrencies.unshift(code);
      if (this.recentCurrencies.length > 5) this.recentCurrencies.pop();
      localStorage.setItem('recentCurrencies', JSON.stringify(this.recentCurrencies));
    },
    
    // History
    addToHistory() {
      const record = {
        from: this.fromCurrency,
        to: this.toCurrency,
        amount: this.amount,
        result: this.convertedAmount,
        rate: this.rate,
        timestamp: new Date().toISOString()
      };
      this.history.unshift(record);
      if (this.history.length > 50) this.history.pop();
      localStorage.setItem('conversionHistory', JSON.stringify(this.history));
    },
    
    // Clipboard
    async copyToClipboard() {
      const text = `${this.amount} ${this.fromCurrency} = ${this.formatNumber(this.convertedAmount)} ${this.toCurrency}`;
      try {
        await navigator.clipboard.writeText(text);
        Swal.fire({
          icon: 'success',
          title: 'Tersalin!',
          text: 'Hasil konversi disalin ke clipboard',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyalin',
          text: 'Tidak dapat menyalin ke clipboard',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    },
    
    // Download result
    downloadResult() {
      const text = `Hasil Konversi Mata Uang\n\n${this.amount} ${this.fromCurrency} = ${this.formatNumber(this.convertedAmount)} ${this.toCurrency}\n\nKurs: 1 ${this.fromCurrency} = ${this.rate.toFixed(4)} ${this.toCurrency}\nKurs Terbalik: 1 ${this.toCurrency} = ${this.inverseRate.toFixed(4)} ${this.fromCurrency}\n\nDihasilkan: ${new Date().toLocaleString('id-ID')}`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `konversi-mata-uang-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    // QR Code
    generateQR() {
      const text = `${this.amount} ${this.fromCurrency} = ${this.formatNumber(this.convertedAmount)} ${this.toCurrency}`;
      const qrContainer = document.getElementById('qr-code');
      qrContainer.innerHTML = '';
      
      if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrContainer, text, { width: 200 }, (error) => {
          if (error) console.error(error);
        });
      }
    },
    
    // Format number
    formatNumber(num) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    },
    
    // Clock
    startClock() {
      this.updateClock();
      setInterval(() => { this.updateClock(); }, 1000);
    },
    
    updateClock() {
      const now = new Date();
      this.clock = now.toLocaleTimeString('id-ID', { hour12: false });
      this.date = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    
    // Countdown timer
    startCountdown() {
      setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.loadRates();
        }
      }, 1000);
    },
    
    // Online listener
    setupOnlineListener() {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.loadRates();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    },
    
    // Keyboard shortcuts
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        if (e.altKey) {
          switch(e.key.toLowerCase()) {
            case 's':
              e.preventDefault();
              this.swapCurrencies();
              break;
            case 'c':
              e.preventDefault();
              this.copyToClipboard();
              break;
            case 'r':
              e.preventDefault();
              this.amount = 1;
              this.updateConversion();
              break;
            case 'd':
              e.preventDefault();
              this.toggleTheme();
              break;
          }
        }
      });
    },
    
    // Confetti
    triggerConfetti() {
      this.showConfetti = true;
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
      
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        document.body.appendChild(confetti);
        
        setTimeout(() => { confetti.remove(); }, 3000);
      }
      
      setTimeout(() => { this.showConfetti = false; }, 3000);
    },
    
    // Filtered currencies for dropdown
    getFilteredCurrencies(search) {
      let currencies = Object.values(this.currencies);
      
      if (this.favorites.length > 0 && !search) {
        const fav = currencies.filter(c => this.favorites.includes(c.code));
        const rest = currencies.filter(c => !this.favorites.includes(c.code));
        currencies = [...fav, ...rest];
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        currencies = currencies.filter(c => 
          c.code.toLowerCase().includes(searchLower) || 
          c.name.toLowerCase().includes(searchLower)
        );
      }
      
      return currencies;
    }
  });
});
