const ADEToken = artifacts.require('ADEToken.sol');
const Spica = artifacts.require('Spica.sol');
const Virgo = artifacts.require('Virgo.sol');
const VirgoAdmin=artifacts.require('VirgoAdmin');
const Web3 = require('web3');
const { BigNumber } = require("@ethersproject/bignumber");
const { getNetworkConfig } = require('../deploy-config');
const Multicall2 = artifacts.require("Multicall2");
const Timelock = artifacts.require("Timelock");

const logTx = (tx) => {
  console.dir(tx, { depth: 3 });
}

module.exports = function(deployer,network, accounts) {
  const { adminAddress, feeAccount,REWARDS_START, STARTING_BLOCK, TOKENS_PER_BLOCK, TIMELOCK_DELAY_SECS, INITIAL_MINT } = getNetworkConfig(network, accounts);
  let adeTokenInstance;
  let spicaInstance;
  let virgoAdminInstance;

  //Deploy AdeToken
  deployer.deploy(ADEToken,100000000000).then((instance)=>{
    adeTokenInstance = instance;
    //mint initial tokens for liquidity pool
    return adeTokenInstance.mint(adminAddress,BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10**18))));
  }).then((tx)=>{
    console.log('aaa',tx)
    logTx(tx);
    return deployer.deploy(Spica,adeTokenInstance.address)
  }).then((instance)=>{
    spicaInstance = instance;
    /**
     * Deploy Virgo
     */
    return deployer.deploy(Virgo,
      ADEToken.address,
      Spica.address,
      feeAccount,
      REWARDS_START
      )
  }).then((instance)=>{

    /**
     * TransferOwnership of AdeToken to Virgo
     */
    return adeTokenInstance.transferOwnership(Virgo.address);
  }).then((tx)=>{
    logTx(tx);
    /**
     * TransferOnwership of Spica to Virgo
     */
    return spicaInstance.transferOwnership(Virgo.address);
  }).then((instance)=>{
    /**
     * Deploy VirgoAdmin
    */
    return deployer.deploy(VirgoAdmin,Virgo.address);
  }).then(() => {
    /**
     * Deploy MultiCall
     */
    return deployer.deploy(Multicall2);
  }).then(() => {
    /**
     * Deploy Timelock
     */
    return deployer.deploy(Timelock, adminAddress, TIMELOCK_DELAY_SECS);
  }).then(() => {
    console.log('Rewards Start at block: ', REWARDS_START)
    console.table({
        Virgo: Virgo.address,
        ADEToken: ADEToken.address,
        Spica: Spica.address,
        Multicall2: Multicall2.address,
        Timelock: Timelock.address
    })
});

};



