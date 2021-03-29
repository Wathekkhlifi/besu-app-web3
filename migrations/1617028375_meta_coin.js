const MetaCoin = artifacts.require('MetaCoin');

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(MetaCoin);
};
