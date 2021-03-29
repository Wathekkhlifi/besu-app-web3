const Web3 = require('web3');
const Test = require('./build/contracts/Test.json');

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

web3.eth.getBlockNumber().then(() => console.log('done !'));

const init = async () => {
  const id = await web3.eth.net.getId();
  const deployedNetwork = Test.networks[id];

  const contract = new web3.eth.Contract(Test.abi, deployedNetwork.address);

  const add = await web3.eth.accounts.wallet.add(
    '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63'
  );

  await contract.methods.setValeur(10).send({
    from: add.address,
    gas: 4600000,
  });

  const data = await contract.methods.getValeur().call();
  console.log(data);
};

init();
