import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// cUSD contract addresses
const CUSD_SEPOLIA = "0x6c23508A9b310C5f2eb2e2eFeBeB748067478667"; // Celo Sepolia
const CUSD_MAINNET = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Celo Mainnet

const ColorMatchRushTreasuryModule = buildModule("ColorMatchRushTreasuryModule", (m) => {
  // Use mainnet address by default, can be overridden via parameter
  const cUSD = m.getParameter("cUSD", CUSD_MAINNET);
  
  const treasury = m.contract("ColorMatchRushTreasury", [cUSD]);
  
  return { treasury };
});

export default ColorMatchRushTreasuryModule;




