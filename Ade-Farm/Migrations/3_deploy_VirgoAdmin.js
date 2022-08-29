const { getNetworkConfig } = require('../deploy-config')
const VirgoAdmin = artifacts.require("VirgoAdmin");


module.exports = async function(deployer, network, accounts) {
    const { virgoAddress, virgoAdminOwner} = getNetworkConfig(network, accounts);

    await deployer.deploy(VirgoAdmin, virgoAddress);
    const virgoAdmin = await VirgoAdmin.at(VirgoAdmin.address);
    await virgoAdmin.transferOwnership(virgoAdminOwner);

    const currentVirgoAdminOwner = await virgoAdmin.owner();

    console.dir({
      VirgoAdminContract: virgoAdmin.address,
      currentVirgoAdminOwner,
    });
};