# Fraudsheild

### Digital Payment Fraud Detection & Campaign Discovery System

Fraudsheild is a full-stack fraud detection system designed to identify suspicious digital payment transactions and uncover coordinated fraud patterns across multiple accounts.

The system combines **rule-based transaction analysis, statistical anomaly detection, campaign detection, explainable alerts, and an investigation dashboard**. Instead of only marking a transaction as suspicious, Fraudsheild also provides the reasons behind the alert and looks for relationships between suspicious accounts.

---

## Problem Statement

Digital payment fraud does not always happen through a single suspicious transaction. A fraud attempt can involve multiple accounts, shared devices, common recipients, unusual transaction timing, or a sudden increase in transaction activity.

A system that only checks individual transactions may miss these coordinated patterns.

Fraudsheild addresses this by using a two-layer detection approach:

1. **Transaction-level risk detection** identifies suspicious individual transactions.
2. **Campaign-level analysis** examines relationships between already suspicious accounts to identify possible coordinated activity.

---

## Key Features

* Real-time transaction monitoring
* Rule-based risk scoring
* Statistical anomaly detection using Isolation Forest
* Risk classification into **LOW, MEDIUM, and HIGH**
* Explainable fraud alerts with human-readable reasons
* Detection of suspicious transaction campaigns
* Shared device and shared recipient analysis
* Coordinated timing detection
* Fraud DNA fingerprint for campaigns
* Live campaign visualization
* Review queue for security investigation
* Confirm / Dismiss campaign actions
* MongoDB-based transaction and campaign storage
* Socket.IO events for real-time dashboard updates
* Transaction simulator for testing different fraud scenarios

---

## How Fraudsheild Works

```text
Transaction Simulator
        |
        v
Transaction Risk Engine
        |
        +----> Risk Level + Reasons
        |
        v
Express Backend
        |
        v
MongoDB
        |
        +----> Dashboard / Alerts
        |
        v
Campaign Detection
        |
        +----> Shared Device
        +----> Shared Recipient
        +----> Coordinated Timing
        |
        v
Campaign + Fraud DNA
        |
        v
React Investigation Dashboard
        |
        v
Confirm / Dismiss
```

### Layer 1 — Transaction Risk Detection

Each transaction is analysed using multiple indicators such as:

* Unusually high transaction amount
* Unusual transaction time
* New or changed device
* Location change
* High transaction frequency
* Statistical anomaly detection

The system assigns a risk level and generates reasons explaining why the transaction was flagged.

Example:

```text
Risk Level: HIGH

Reasons:
- Unusual transaction amount
- Unusual transaction time
- New device detected
- Statistical anomaly detected
```

### Layer 2 — Campaign Detection

Transactions classified as **MEDIUM or HIGH risk** can be examined for relationships with other suspicious transactions.

The campaign detector looks for patterns such as:

* Multiple accounts using the same device
* Multiple accounts sending money to the same recipient
* Transactions occurring within a coordinated time window

When related accounts are identified, the system creates a campaign with a unique campaign ID.

Example:

```text
Campaign: CMP002

Accounts:
ACC101
ACC102
ACC103

Pattern:
Shared Device
Shared Recipient
Coordinated Timing
```

---

## Fraud DNA

Each detected campaign is summarized using a small set of indicators called **Fraud DNA**.

The current system tracks:

| Indicator        | Description                                         |
| ---------------- | --------------------------------------------------- |
| Velocity         | Number of transactions associated with the campaign |
| Shared Device    | Whether suspicious accounts share a device          |
| Shared Recipient | Whether suspicious accounts share a recipient       |
| Timing Pattern   | Whether transactions show coordinated timing        |

This gives investigators a quick overview of the pattern behind a campaign.

---

## Dashboard

The React dashboard provides a central view of the system.

It displays:

* Total transactions monitored
* High-risk alerts
* Medium-risk transactions
* Active campaigns
* Risk distribution
* Recent alerts
* Campaign accounts
* Fraud DNA
* Review queue

The dashboard receives real-time events through **Socket.IO**, allowing new transactions, alerts, campaigns, and campaign updates to appear without manually rebuilding the application.

---

## Transaction Simulator

Fraudsheild includes a transaction simulator for testing the detection pipeline without relying on a real payment system.

The simulator generates:

* Normal transactions
* A high-risk individual transaction
* A coordinated multi-account campaign
* Additional transaction activity for testing detection behaviour

The simulator sends analysed transactions to the backend through the detection API.

---

## Technology Stack

### Frontend

* React
* Vite
* Axios
* Socket.IO Client
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* CORS

### Detection

* JavaScript-based rule engine
* Isolation Forest anomaly detection
* Graph-based campaign relationship analysis
* Graphology

### Development

* Git
* GitHub
* Postman
* MongoDB Compass

---

## Project Structure

```text
Fraudsheild/
│
├── Backend/
│   ├── src/
│   │   ├── detection/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── socket/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── app.jsx
│   ├── app.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── Simulator/
│   ├── src/
│   │   └── detection/
│   ├── index.js
│   ├── runSimulation.js
│   └── package.json
│
└── .gitignore
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* MongoDB
* Git
* A modern web browser

---

## 1. Clone the Repository

```bash
git clone https://github.com/Sampoorna2007/Fraudsheild.git
cd Fraudsheild
```

---

## 2. Start the Backend

Open a terminal:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/fraudsheild
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## 3. Start the Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Vite will provide the local frontend URL, usually:

```text
http://localhost:5173
```

If that port is already in use, Vite may select another available port.

---

## 4. Run the Transaction Simulator

Open another terminal:

```bash
cd Simulator
npm install
node runSimulation.js
```

The simulator will:

1. Generate transactions
2. Run the risk engine
3. Send analysed transactions to the backend
4. Detect related suspicious accounts
5. Send detected campaigns to the backend

The results can then be viewed on the React dashboard.

---

## API Overview

### Transactions

```text
POST /api/transactions
GET  /api/transactions
GET  /api/transactions/:transactionId
```

### Campaigns

```text
POST  /api/campaigns
GET   /api/campaigns
GET   /api/campaigns/:campaignId
PATCH /api/campaigns/:campaignId/status
```

### Detection

```text
POST /api/detection/layer1
POST /api/detection/layer2
```

### Dashboard

```text
GET /api/dashboard
```

---

## Risk Classification

Fraudsheild uses multiple transaction-level indicators to calculate a risk score.

The current implementation classifies transactions into:

```text
LOW
MEDIUM
HIGH
```

The alert also contains the individual reasons that contributed to the detection, making the result easier for an investigator to understand.

---

## Review Workflow

Detected campaigns are placed into a review queue.

An investigator can:

* **Confirm** — mark the campaign as confirmed
* **Dismiss** — mark the campaign as dismissed
* **Watch** — keep the campaign under observation

Campaign status updates are stored in MongoDB and broadcast through Socket.IO.

---

## Example Detection Scenario

A coordinated campaign can look like this:

```text
ACC101 ─┐
        |
ACC102 ─┼── Shared Device
        |    Shared Recipient
ACC103 ─┘    Coordinated Timing
```

Instead of treating these as three unrelated transactions, Fraudsheild groups the related accounts into a campaign so that the investigator can examine the wider pattern.

---

## Team

### VerStack — Versathon 2.0

**Sampoorna**
Backend & Integration

* Express backend
* MongoDB integration
* Socket.IO
* Detection API integration
* Simulator-to-backend integration

**Sushrutha**
Detection & Data

* Transaction simulator
* Risk detection logic
* Campaign detection
* Anomaly detection
* Detection testing

**Vaishnavi**
Frontend

* React dashboard
* Campaign visualization
* Fraud DNA interface
* Review queue
* Frontend styling

---

## Project Status

Fraudsheild currently provides a working end-to-end demonstration of:

```text
Transaction Generation
        ↓
Risk Detection
        ↓
Explainable Alerts
        ↓
Campaign Discovery
        ↓
Fraud DNA
        ↓
MongoDB Storage
        ↓
Real-Time Dashboard
        ↓
Investigation & Review
```

The project was developed as a hackathon prototype with a focus on demonstrating the complete fraud detection and investigation workflow.

---

## Repository

GitHub:

https://github.com/Sampoorna2007/Fraudsheild

---

## License

This project was developed as a hackathon project for educational and demonstration purposes.
