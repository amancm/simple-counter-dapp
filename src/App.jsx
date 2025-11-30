import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";

// 🔹 Your deployed contract address (from Remix / Etherscan)
const contractAddress = "0x68E35E3eeF7fcd4c1ca64A7B68A3A793312d53aC";

// 🔹 Etherscan base URL (change if you use a different network)
// Mainnet:  https://etherscan.io
// Sepolia:  https://sepolia.etherscan.io
const ETHERSCAN_BASE_URL = "https://sepolia.etherscan.io";

// 🔹 ABI matching your Solidity contract with events + history
// contract used:
//
// event MessageAdded(string message, address indexed sender, uint256 timestamp);
// function count() public view returns (uint256);
// function increment(string calldata _message) external;
// function reset() external;
// function getHistoryCount() external view returns (uint256);
// function getMessage(uint256 index) external view returns (string,address,uint256);
//
const contractABI = [
  "function count() view returns (uint256)",
  "function increment(string _message) external",
  "function reset() external",
  "function getHistoryCount() view returns (uint256)",
  "function getMessage(uint256 index) view returns (string,address,uint256)",
  "event MessageAdded(string message,address indexed sender,uint256 timestamp)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [count, setCount] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 🔹 Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      await loadAllData();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // 🔹 Get Contract instance
  const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  };

  // 🔹 Load count + history
  const loadAllData = async () => {
    try {
      const contract = await getContract();

      const value = await contract.count();
      setCount(Number(value));

      await loadHistory(contract);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // 🔹 Load message history
  const loadHistory = async (contractFromArg) => {
    try {
      setLoadingHistory(true);
      const contract = contractFromArg || (await getContract());
      const total = await contract.getHistoryCount();

      const temp = [];
      for (let i = 0; i < Number(total); i++) {
        const entry = await contract.getMessage(i);
        temp.push({
          message: entry[0],
          sender: entry[1],
          timestamp: new Date(Number(entry[2]) * 1000).toLocaleString(),
        });
      }
      // latest first
      setHistory(temp.reverse());
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 🔹 Increment + send message to blockchain
  const handleIncrement = async () => {
    if (!messageInput.trim()) {
      alert("Please enter a message before incrementing.");
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.increment(messageInput.trim());
      await tx.wait();
      setMessageInput("");
      await loadAllData();
    } catch (error) {
      console.error("Error incrementing:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset counter + history on-chain
  const handleReset = async () => {
    if (!window.confirm("Reset count and clear all messages on-chain?")) return;

    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.reset();
      await tx.wait();
      await loadAllData();
    } catch (error) {
      console.error("Error resetting:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open contract page on Etherscan
  const openEtherscan = () => {
    if (!contractAddress || !contractAddress.startsWith("0x")) {
      alert("Invalid contract address.");
      return;
    }
    const url = `${ETHERSCAN_BASE_URL}/address/${contractAddress}`;
    window.open(url, "_blank");
  };

  // 🔹 React to MetaMask account change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        const acc = accounts[0] || null;
        setAccount(acc);
        if (acc) {
          loadAllData();
        } else {
          setCount(null);
          setHistory([]);
        }
      });
    }
  }, []);

  return (
    <div className="app-root">
      <div className="app-card">
        <h1 className="app-title">Simple Counter DApp</h1>
        <p className="app-subtitle">
          React + MetaMask + On-Chain Messages
        </p>

        {/* Wallet / Connect */}
        {!account ? (
          <button className="btn primary" onClick={connectWallet}>
            Connect MetaMask
          </button>
        ) : (
          <div className="wallet-info">
            <span className="wallet-label">Connected</span>
            <span className="wallet-address">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        )}

        {/* Etherscan Button */}
        <div className="etherscan-row">
          <button className="btn outline" onClick={openEtherscan}>
            View Contract on Etherscan
          </button>
        </div>

        {/* Counter card */}
        <div className="counter-card">
          <span className="counter-label">Current Count</span>
          <span className="counter-value">
            {count !== null ? count : "—"}
          </span>
        </div>

        {/* Message input */}
        <div className="message-box">
          <label className="message-label">
            Message to store on blockchain
          </label>
          <input
            className="message-input"
            type="text"
            placeholder="Enter a short message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="button-row">
          <button
            className="btn secondary"
            onClick={handleIncrement}
            disabled={!account || loading}
          >
            {loading ? "Processing..." : "Increment + Save Message"}
          </button>

          <button
            className="btn danger"
            onClick={handleReset}
            disabled={!account || loading}
          >
            {loading ? "Processing..." : "Reset All"}
          </button>
        </div>

        <p className="network-hint">
          Every increment sends a transaction and stores your message on-chain.
          View them as <b>MessageAdded</b> events on Etherscan.
        </p>

        {/* History */}
        <div className="history-box">
          <div className="history-header">
            <h3>Message History</h3>
            {loadingHistory && (
              <span className="history-loading">Loading…</span>
            )}
          </div>

          {history.length === 0 && !loadingHistory && (
            <p className="history-empty">No messages yet. Be the first!</p>
          )}

          {history.map((item, index) => (
            <div key={index} className="history-item">
              <p className="history-message">“{item.message}”</p>
              <p className="history-meta">
                <span>
                  From: {item.sender.slice(0, 6)}...{item.sender.slice(-4)}
                </span>
                <span>At: {item.timestamp}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
