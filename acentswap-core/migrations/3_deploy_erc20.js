const AcentERC20 = artifacts.require("AcentERC20");

module.exports = function (deployer) {
  deployer.deploy(AcentERC20);
};
