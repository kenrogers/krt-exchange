import { ethers } from "ethers";

import "./App.css";

function App() {
  // request the user's MetaMask account
  // we'll use this when we need the user to sign transactions that will modify the blockchain
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="text-xs">KRT Exchange</p>
      </header>
    </div>
  );
}

export default App;
