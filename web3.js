const Web3 = require('web3');
const Test = require('./build/contracts/Test.json');

const init = async () => {
  const web3 = new Web3('http://localhost:8545');

  const id = await web3.eth.net.getId();
  const deployedNetwork = Test.networks[id];
  const contract = new web3.eth.Contract(Test.abi, deployedNetwork.address);

  const adresses = web3.eth.getAccounts();
  console.log(adresses[0]);

  await contract.methods.setValeur(10).send({
    from: adresses[0],
  });

  const data = await contract.methods.getValeur().call();

  console.log(data);
};

try {
  init();
} catch (error) {
  console.log(error);
}
