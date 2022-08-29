const AcentFactory = artifacts.require("AcentFactory");
const { getNetworkConfig } = require('../migration-config');

module.exports = async function (deployer, network, accounts) {
  const { feeToSetterAddress } = getNetworkConfig(network, accounts);
  await deployer.deploy(AcentFactory, feeToSetterAddress);

  const acentFactory = await AcentFactory.deployed();
  console.log(`INIT_CODE_PAIR_HASH: ${await acentFactory.INIT_CODE_PAIR_HASH()}`)

};
