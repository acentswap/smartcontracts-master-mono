const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "be6c6b3b4445430ebeacf3c63136ebaf";
// const mnemonic = "alcohol enter post double chapter scan pair vocal ripple region success surround";
const mnemonic = "alcohol enter post double chapter scan pair vocal ripple region success surround";
const secret="c651df0d97342b7a8af0dc87d6bf7c16cf33ce0955f12cb3fd8b56d676d2546e"
module.exports = {
  networks: {
    // mainnet: {
    //   provider: () => new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/be6c6b3b4445430ebeacf3c63136ebaf"),
    //   network_id: 1,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
    acenttest: {
      provider: () => new HDWalletProvider(secret,"http://mainsk.acent.online:8545"),
      network_id: 8989,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: "0x745b3eF0c262d17f07779F8453bF6358B296F9F8"
    },
    acentph: {
      provider: () => new HDWalletProvider(secret, "http://3.37.4.143:8545"),
      network_id: 8899,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: "0x745b3eF0c262d17f07779F8453bF6358B296F9F8"
    },    
    // goerli: {
    //   provider: () => new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/be6c6b3b4445430ebeacf3c63136ebaf"),
    //   network_id: 5,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
    // kovan: {
    //   provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/be6c6b3b4445430ebeacf3c63136ebaf"),
    //   network_id: 42,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
  },
  mocha: {
    // "timeout": 100000,
  },

  compilers: {
    solc: {
      version: "0.6.12",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}