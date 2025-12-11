// Simple JS script to test if Hardhat loads .env
console.log("Testing environment variable loading...");
console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
console.log("PRIVATE_KEY first 10 chars:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.substring(0, 10) : "N/A");

