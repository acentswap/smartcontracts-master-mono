const ADERouter = artifacts.require("ADERouter");
const { getNetworkConfig } = require('./migration-config');

const logTx = (tx) => {
  console.dir(tx, { depth: 3 });
}


module.exports = async function (deployer, network, accounts) {
  const { factoryAddress, wrappedAddress } = getNetworkConfig(network, accounts); 
  
  deployer.deploy(ADERouter, factoryAddress, wrappedAddress);
};
