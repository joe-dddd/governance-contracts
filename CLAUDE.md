# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Venus Protocol governance contracts: Governor Bravo, Timelock, AccessControlManager, and omnichain governance via LayerZero. Solidity smart contracts deployed to BSC, Ethereum, Arbitrum, Optimism, Base, opBNB, zkSync, and Unichain.

## Commands

```bash
yarn install                # Install dependencies (yarn 3.2.0)
yarn compile                # Compile contracts (standard + zkSync)
yarn test                   # Run tests
yarn lint                   # Run all linters (ts, sol, prettier)
yarn clean                  # Clean artifacts/cache

# Single test file
npx hardhat test tests/Governance/GovernanceBravo/castVoteTest.ts

# Deploy
npx hardhat deploy --network <network> --tags <tag>

# Fork testing
FORK=true FORKED_NETWORK=bscmainnet yarn test

# Coverage
npx hardhat coverage

# Export deployments
yarn hardhat export --network <network> --export ./deployments/<network>.json

# Fetch ACM permissions
npx hardhat run scripts/ACMPermissions/index.ts --network <network>
```

## Architecture

### Core Contracts (`contracts/Governance/`)

- **AccessControlManager**: Role-based access control for all Venus contracts. Roles computed as `keccak256(contractAddress, functionSig)`. Admin roles use zero address for contract-wide permissions.
- **GovernorBravoDelegate**: Main governance logic with 3 proposal types (NORMAL, FASTTRACK, CRITICAL) - each with different voting delays, periods, and timelocks
- **GovernorBravoDelegator**: Proxy for GovernorBravoDelegate
- **Timelock/TimelockV8**: Execution delay for governance proposals

### Omnichain Governance (`contracts/Cross-chain/`)

LayerZero-based cross-chain governance:
- **OmnichainProposalSender**: Sends proposals from BSC to remote chains
- **OmnichainGovernanceExecutor**: Receives and executes proposals on remote chains
- **OmnichainExecutorOwner**: Manages executor permissions on remote chains
- **BaseOmnichainControllerSrc/Dest**: Base contracts for LayerZero integration

### Utilities (`contracts/Utils/`)

- **ACMCommandsAggregator**: Batch permission grants/revokes for ACM

## Key Concepts

**VIP Types**: Proposals have 3 routes (NORMAL/FASTTRACK/CRITICAL) with different parameters and timelocks.

**ACM Integration**: Contracts inherit `AccessControlledV5` or `AccessControlledV8` and call `_checkAccessAllowed("functionSig(params)")`.

**Deployment Flow**: Deploy scripts in `deploy/` numbered 000-011, managed by hardhat-deploy with tags and skip conditions.

## Environment Variables

```
DEPLOYER_PRIVATE_KEY=       # Deployment key
MNEMONIC=                   # Alternative to private key (testnet)
FORK=true                   # Enable fork testing
FORKED_NETWORK=bscmainnet   # Network to fork
ARCHIVE_NODE_<network>=     # RPC URLs per network
ETHERSCAN_API_KEY=          # Contract verification
```

## Supported Networks

bscmainnet, bsctestnet, ethereum, sepolia, arbitrumone, arbitrumsepolia, opmainnet, opsepolia, basemainnet, basesepolia, opbnbmainnet, opbnbtestnet, unichainmainnet, unichainsepolia, zksyncmainnet, zksyncsepolia

## Solidity

- Primary version: 0.8.25 (ACM, Cross-chain)
- Legacy version: 0.5.16 (GovernorBravo)
- OpenZeppelin 4.8.2
