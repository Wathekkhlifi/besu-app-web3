const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx').Transaction;
const MetaCoin = require('./build/contracts/MetaCoin.json');

const app = express();

//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider('https://localhost:8545'));

app.get('/sendtx', async (req, res) => {
  var myAddress = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';
  var privateKey = Buffer.from(
    '8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63',
    'hex'
  );
  var toAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';

  //contract abi is the array that you can get from the ethereum wallet or etherscan
  var contractABI = MetaCoin.abi;
  var contractAddress = '0x43D1F9096674B5722D359B6402381816d5B22F28';
  //creating contract object
  var contract = new web3js.eth.Contract(contractABI, contractAddress);

  // get transaction count, later will used as nonce

  try {
    var data = await contract.methods.getBalance(myAddress).call();
    console.log(data);
    /*
    var data = await contract.methods.sendCoin(toAddress, '1').send({
      from: myAddress,
    });
    console.log(data + '*****************');
    
      //creating raw tranaction
      var rawTransaction = {
        from: myAddress,
        gasPrice: web3js.utils.toHex(20 * 1e9),
        gasLimit: web3js.utils.toHex(210000),
        to: contractAddress,
        value: '0x0',
        data: data,
        nonce: web3js.utils.toHex(count),
      };
      console.log(rawTransaction);

      //creating tranaction via ethereumjs-tx
      var transaction = new Tx(rawTransaction, { "chain": besuWallet});

      //signing transaction with private key
      transaction.sign(privateKey);

      //sending transacton via web3js module
      web3js.eth
        .sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        .on('transactionHash', console.log);*/

    contract.methods
      .getBalance(myAddress)
      .call()
      .then(function (balance) {
        console.log(balance);
      });

    res.status(200).send('ok');
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
