const Test = artifacts.require('Test');

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Test);
};
