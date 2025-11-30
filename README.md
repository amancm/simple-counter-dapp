🧠 Simple Counter DApp – React + Solidity + MetaMask + Etherscan

A Web3 decentralized application (DApp) that stores a counter value and user messages on the blockchain, with full support for MetaMask, Etherscan event logs, and a modern UI built using React (Vite) and Ethers.js.

🚀 Features

🔗 Smart Contract (Solidity)

🦊 MetaMask Wallet Integration

⚡ Increment Counter + Save Message On-Chain

📖 Real-Time Message History

🔍 One-Click “View on Etherscan”

📝 Event Logs (MessageAdded) visible on Etherscan

🎨 Modern UI with custom CSS

🔄 Auto-update when wallet changes

♻️ Reset function clears counter + history

📦 Tech Stack
Component	Technology
Frontend	React (Vite)
Blockchain	Ethereum Sepolia Testnet
Smart Contract	Solidity
Wallet	MetaMask
Web3 Library	Ethers.js v6
Explorer	Etherscan
📜 Smart Contract Overview

The contract supports:

Increment counter with a message

Store every message in an array

Track:

Message text

Sender wallet

Timestamp

Emit MessageAdded event

Reset full history

event MessageAdded(string message, address indexed sender, uint256 timestamp);

🖥️ Frontend Overview

The React DApp allows users to:

Connect MetaMask

Enter a custom message

Increment on-chain counter

See message history instantly

View Etherscan logs

Reset the blockchain state

Auto-refresh on wallet account change

🔗 Etherscan Integration

Every increment creates a blockchain event:

MessageAdded(message, sender, timestamp)


You can view all events under:

Etherscan → Events → Logs

The DApp includes a button:

View Contract on Etherscan


This opens the contract page instantly.

📂 Project Structure
simple-counter-dapp/
│
├── src/
│   ├── App.jsx        # Main DApp logic
│   ├── index.css      # UI Styling
│   ├── main.jsx       # React entry point
│
├── package.json
├── vite.config.js
├── README.md

▶️ How to Run the Project
npm install
npm run dev


Open in browser:

http://localhost:5173


Make sure MetaMask is installed and connected to Sepolia testnet.

⚙️ Deployment

You can deploy the frontend using:

Vercel

Netlify

GitHub Pages

(Ask if you want help deploying.)
