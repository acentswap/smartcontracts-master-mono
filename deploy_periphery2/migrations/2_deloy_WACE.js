const ADERouter = artifacts.require("ADERouter");
const WACE = artifacts.require("WACE");
const { getNetworkConfig } = require('./migration-config');


module.exports = async function (deployer, network, accounts) {
  const { factoryAddress, wrappedAddress } = getNetworkConfig(network, accounts);

  let finalWrappedAddress = wrappedAddress;
  if(!finalWrappedAddress || finalWrappedAddress == '0x') {
    console.log(`Wrapped address is empty. Deploying new wrapped contract.`);
    await deployer.deploy(WACE);
    finalWrappedAddress = (await WACE.deployed()).address;
    console.log(finalAddress);
  };
  
  await deployer.deploy(ADERouter, factoryAddress, finalWrappedAddress);
};
