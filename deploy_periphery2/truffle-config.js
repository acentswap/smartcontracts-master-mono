const HDWalletProvider = require('truffle-hdwallet-provider');
// require('dotenv').config();

const BSC_DEPLOYER_KEY = process.env.BSC_DEPLOYER_KEY;
const BSC_TESTNET_DEPLOYER_KEY = process.env.BSC_TESTNET_DEPLOYER_KEY;
const ACENT_DEPLOYER_KEY = process.env.ACENT_DEPLOYER_KEY;

const mnemonic = "c651df0d97342b7a8af0dc87d6bf7c16cf33ce0955f12cb3fd8b56d676d2546e";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard BSC port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    testnet: {
      provider: () => new HDWalletProvider(BSC_TESTNET_DEPLOYER_KEY, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581'
    },
    bsc: {
      provider: () => new HDWalletProvider(BSC_DEPLOYER_KEY, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    acent: {
      provider: () => new HDWalletProvider(mnemonic, `http://3.37.4.143:8545`),
      network_id: 8899,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8'
    },
    acenttest: {
      provider: () => new HDWalletProvider(mnemonic, `http://mainsk.acent.online:8545`),
      network_id: 8989,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8'
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    // Add BSCSCAN_API_KEY in .env file to verify contracts deployed through truffle
    etherscan: process.env.BSCSCAN_API_KEY
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      //https://forum.openzeppelin.com/t/how-to-deploy-uniswapv2-on-ganache/3885
      version: "0.6.6",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    },
  }
}