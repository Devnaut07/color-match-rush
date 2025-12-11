import hre from "hardhat";
import { formatEther } from "viem";

async function main() {
  // cUSD address on Celo Mainnet
  const CUSD_MAINNET = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  
  console.log("Deploying ColorMatchRushTreasury to Celo Mainnet...");
  console.log("cUSD address:", CUSD_MAINNET);
  
  // Get wallet clients - Hardhat should have loaded accounts from config
  const walletClients = await hre.viem.getWalletClients();
  if (!walletClients || walletClients.length === 0) {
    throw new Error("No wallet clients found. Check your PRIVATE_KEY in .env file and hardhat.config.ts");
  }
  
  const deployer = walletClients[0];
  const deployerAddress = deployer.account.address;
  console.log("Deploying with account:", deployerAddress);
  
  const publicClient = await hre.viem.getPublicClient();
  const balance = await publicClient.getBalance({ address: deployerAddress });
  console.log("Account balance:", formatEther(balance), "CELO");
  
  if (balance === 0n) {
    throw new Error("Account has no CELO for gas fees. Please fund your account.");
  }
  
  const treasury = await hre.viem.deployContract("ColorMatchRushTreasury", [CUSD_MAINNET]);
  
  console.log("Deployment transaction hash:", treasury.hash);
  
  await treasury.waitForDeployment();
  const address = treasury.address;
  
  console.log("\n✅ ColorMatchRushTreasury deployed to:", address);
  
  const owner = await treasury.read.owner();
  const cUSD = await treasury.read.cUSD();
  
  console.log("Owner:", owner);
  console.log("cUSD:", cUSD);
  console.log("\nUpdate your .env.local with:");
  console.log(`NEXT_PUBLIC_TREASURY_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

