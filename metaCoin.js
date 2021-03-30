const Web3 = require('web3');
const MetaCoin = require('./build/contracts/MetaCoin.json');

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

web3.eth.getBlockNumber().then(() => console.log('done !'));

const init = async () => {
  const id = await web3.eth.net.getId();
  const deployedNetwork = MetaCoin.networks[id];

  const contract = new web3.eth.Contract(MetaCoin.abi, deployedNetwork.address);

  const add = await web3.eth.accounts.wallet.add(
    '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63'
  );

  console.log(add.address);

  var data = await contract.methods.getBalance(add.address).call();
  console.log('balance account 1: ' + data);

  await contract.methods
    .sendCoin('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', '10')
    .send({
      from: add.address,
      gas: 4600000,
    });

  data = await contract.methods
    .getBalance('0x627306090abaB3A6e1400e9345bC60c78a8BEf57')
    .call();
  console.log('balance account 2 : ' + data);

  data = await contract.methods.getBalance(add.address).call();
  console.log('balance account 1: ' + data);

  const balance = web3.utils.fromWei(
    await web3.eth.getBalance(add.address),
    'ether'
  );

  console.log('Ether balance 1st account: ' + balance);
};

init();
