# KeyVault RSA - Applicazione Frontend

## Panoramica
KeyVault RSA è un'applicazione web basata su React che fornisce una piattaforma sicura per gestire e scambiare chiavi pubbliche RSA. L'applicazione consente agli utenti di registrarsi, accedere, caricare le proprie chiavi RSA, visualizzare le chiavi pubbliche di altri utenti e gestire le proprie chiavi.

## Funzionalità
- 🔐 **Autenticazione Utente**: Sistema sicuro di login e registrazione
- 🔑 **Gestione Chiavi**: Caricamento, visualizzazione e disattivazione delle chiavi RSA
- 🔍 **Ricerca Chiavi**: Cerca altri utenti e le loro chiavi pubbliche
- 📊 **Statistiche**: Visualizza la distribuzione delle dimensioni delle chiavi RSA
- 🌓 **Supporto Tema**: Passa facilmente tra modalità chiara e scura
- 📱 **Design Responsive**: Funziona su diverse dimensioni di schermo

## Tecnologie Utilizzate
- **React 19**: Libreria moderna per la creazione di interfacce utente
- **Vite**: Strumento di build veloce e server di sviluppo
- **React Router v7**: Per il routing lato client
- **Ant Design**: Libreria di componenti UI
- **Tailwind CSS**: Framework CSS utility-first
- **Redux Toolkit**: Libreria per la gestione dello stato
- **Axios**: Client HTTP per richieste API
- **ECharts**: Libreria per la visualizzazione dei dati

## Prerequisiti
- Node.js (v18 o superiore)
- npm o yarn

## Configurazione e Installazione
1. Clona il repository:
   ```bash
   git clone https://github.com/Teooo06/frontend1RSA.git
   cd frontend1RSA
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   # oppure
   yarn install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   # oppure
   yarn dev
   ```

4. Build per la produzione:
   ```bash
   npm run build
   # oppure
   yarn build
   ```

5. Anteprima della build di produzione:
   ```bash
   npm run preview
   # oppure
   yarn preview
   ```

## Struttura del Progetto
```
frontend1RSA/
├── public/              # Asset pubblici
├── src/                 # File sorgenti
│   ├── components/      # Componenti UI riutilizzabili
│   ├── contex/          # Provider di contesto React
│   ├── pages/           # Componenti delle pagine
│   ├── redux/           # Store e slice Redux
│   ├── styles/          # File CSS e stili
│   ├── App.jsx          # Componente principale dell'applicazione
│   ├── main.jsx         # Punto di ingresso
│   └── router.jsx       # Configurazione del router
├── index.html           # Template HTML
├── vite.config.js       # Configurazione Vite
├── tailwind.config.js   # Configurazione Tailwind CSS
├── postcss.config.js    # Configurazione PostCSS
└── package.json         # Dipendenze e script
```

## Guida all'Uso

### Autenticazione
- Visita la homepage per visualizzare le chiavi pubbliche senza accedere
- Clicca su "Accedi" per accedere se hai già un account
- Clicca su "Registrati" per creare un nuovo account

### Gestione delle Chiavi
- Dopo aver effettuato l'accesso, accedi all'"Area Personale" per visualizzare le tue chiavi
- Usa "Carica Nuova Chiave" per caricare una nuova chiave pubblica RSA
- Disattiva le chiavi che non sono più in uso

### Ricerca Chiavi
- Usa la barra di ricerca per trovare utenti o chiavi per nome, username o contenuto della chiave
- Copia le chiavi pubbliche con il pulsante "Copia Chiave"

### Cambio Tema
- Clicca sull'icona della lampadina nell'header per passare tra modalità chiara e scura

## Integrazione API
Questo frontend si connette a un server backend Java Spring che gestisce:
- Autenticazione degli utenti
- Archiviazione e recupero delle chiavi
- Validazione delle chiavi

URL base API backend: `http://localhost:8080/api/`

## Supporto Browser
- Chrome, Firefox, Safari, Edge (versioni più recenti)
- Design responsive per browser desktop e mobili

## Contribuire
I contributi sono benvenuti! Si prega di seguire questi passaggi:
1. Forka il repository
2. Crea un branch per la funzionalità: `git checkout -b feature/funzionalita-incredibile`
3. Commit dei tuoi cambiamenti: `git commit -m 'Aggiungi funzionalità incredibile'`
4. Push al branch: `git push origin feature/funzionalita-incredibile`
5. Apri una Pull Request

## Licenza
Questo progetto è concesso in licenza secondo la Licenza ISC - vedi il file LICENSE per i dettagli.
