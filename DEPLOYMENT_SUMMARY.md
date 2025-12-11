# 🎉 Treasury Contract Deployed to Celo Mainnet!

## ✅ Deployment Complete

**Contract Address:** `0xc328abADc8e0B205948ECD359F341bd9F3d7ebD2`  
**Network:** Celo Mainnet (Chain ID: 42220)  
**cUSD Address:** `0x765DE816845861e75A25fCA122bb6898B8B1282a`  
**Explorer:** https://celoscan.io/address/0xc328abADc8e0B205948ECD359F341bd9F3d7ebD2

## 📋 What Was Done

1. ✅ Fixed treasury contract to use proper IERC20 interface
2. ✅ Updated deployment configuration for Celo mainnet
3. ✅ Fixed .env file (removed duplicate PRIVATE_KEY entries)
4. ✅ Deployed contract to Celo mainnet
5. ✅ Updated frontend to use mainnet cUSD address
6. ✅ Updated frontend to check for Celo mainnet (chain ID 42220)
7. ✅ Updated default treasury address to deployed contract

## 🔧 Required Updates

### Update `apps/web/.env.local`

Add or update the following:

```bash
NEXT_PUBLIC_TREASURY_ADDRESS=0xc328abADc8e0B205948ECD359F341bd9F3d7ebD2
```

## 🎮 Contract Features

The `ColorMatchRushTreasury` contract:
- ✅ Receives entry fees (cUSD transfers)
- ✅ Tracks round pools
- ✅ Distributes prizes to top 3 winners (50/30/20 split)
- ✅ Owner-controlled prize distribution
- ✅ Emergency withdraw function (owner only)

## 📝 Contract Functions

### For Players
- Send cUSD directly to the contract address (standard ERC20 transfer)

### For Owner (You)
- `distributePrizes(roundId, firstPlace, secondPlace, thirdPlace)` - Distribute prizes
- `updateRoundPool(roundId, amount)` - Update round pool
- `endRound(roundId)` - End a round
- `emergencyWithdraw(amount)` - Emergency withdraw
- `emergencyWithdrawAll()` - Withdraw all funds

## 🔗 Links

- **Contract on Celoscan:** https://celoscan.io/address/0xc328abADc8e0B205948ECD359F341bd9F3d7ebD2
- **cUSD on Celoscan:** https://celoscan.io/address/0x765DE816845861e75A25fCA122bb6898B8B1282a

## ⚠️ Next Steps

1. Update `apps/web/.env.local` with the contract address
2. Test the contract by sending a small amount of cUSD to it
3. Verify the contract on Celoscan (optional but recommended)
4. Update your frontend deployment with the new environment variable

## 🎯 Prize Distribution

When a round ends, call `distributePrizes()` with:
- `roundId`: The current round ID
- `firstPlace`: Winner address (50% of pool)
- `secondPlace`: Runner-up address (30% of pool)
- `thirdPlace`: Third place address (20% of pool)

The contract will automatically transfer the prizes to the winners!

