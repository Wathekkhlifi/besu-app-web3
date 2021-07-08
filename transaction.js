const Web3 = require('web3');
const ethTx = require('ethereumjs-tx');
const readline = require('readline');

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

const args = process.argv.slice(2);

// web3 initialization - must point to the HTTP JSON-RPC endpoint
var provider = args[0] || 'http://localhost:8545';
console.log('******************************************');
console.log('Using provider : ' + provider);
console.log('******************************************');
var web3 = new Web3(new Web3.providers.HttpProvider(provider));
web3.transactionConfirmationBlocks = 1;
// Sender address and private key
// Second acccount in dev.json genesis file
// Exclude 0x at the beginning of the private key
const addressFrom = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
const privKey = Buffer.from(
  'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  'hex'
);

// Receiver address and value to transfer
// Third account in dev.json genesis file
const addressTo = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
const valueInEther = 2;

// Get the address transaction count in order to specify the correct nonce
web3.eth
  .getTransactionCount(addressFrom, 'pending')
  .then((txnCount) => {
    // Create the transaction object
    var txObject = {
      nonce: web3.utils.numberToHex(txnCount),
      gasPrice: web3.utils.numberToHex(1000),
      gasLimit: web3.utils.numberToHex(21000),
      to: addressTo,
      value: web3.utils.numberToHex(
        web3.utils.toWei(valueInEther.toString(), 'ether')
      ),
    };

    // Sign the transaction with the private key
    var tx = new ethTx(txObject);
    tx.sign(privKey);

    //Convert to raw transaction string
    var serializedTx = tx.serialize();
    var rawTxHex = '0x' + serializedTx.toString('hex');

    // log raw transaction data to the console so you can send it manually
    console.log('Raw transaction data: ' + rawTxHex);

    // but also ask you if you want to send this transaction directly using web3
    (async () => {
      const ans = await askQuestion(
        '******************************************\n\
Do you want to send the signed value transaction now ? (Y/N):'
      );
      if ('y' == ans || 'Y' == ans) {
        // Send the signed transaction using web3
        web3.eth
          .sendSignedTransaction(rawTxHex)
          .on('receipt', (receipt) => {
            console.log('Receipt: ', receipt);
          })
          .catch((error) => {
            console.log('Error: ', error.message);
          });
        console.log('******************************************');
        console.log('Value transaction sent, waiting for receipt.');
        console.log('******************************************');
      } else {
        console.log('******************************************');
        console.log(
          'You can for instance send this transaction manually with the following command:'
        );
        console.log(
          'curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["' +
            rawTxHex +
            '"],"id":1}\'',
          provider
        );
      }
    })();
  })
  .catch((error) => {
    console.log('Error: ', error.message);
  });

async function getTransactionsByAccount(
  myaccount,
  startBlockNumber,
  endBlockNumber
) {
  if (endBlockNumber == null) {
    endBlockNumber = await web3.eth.blockNumber;
    console.log('Using endBlockNumber: ' + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log('Using startBlockNumber: ' + startBlockNumber);
  }
  console.log(
    'Searching for transactions to/from account "' +
      myaccount +
      '" within blocks ' +
      startBlockNumber +
      ' and ' +
      endBlockNumber
  );

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log('Searching block ' + i);
    }
    var block = await web3.eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach(function (e) {
        if (myaccount == '*' || myaccount == e.from || myaccount == e.to) {
          console.log(
            '  tx hash          : ' +
              e.hash +
              '\n' +
              '   nonce           : ' +
              e.nonce +
              '\n' +
              '   blockHash       : ' +
              e.blockHash +
              '\n' +
              '   blockNumber     : ' +
              e.blockNumber +
              '\n' +
              '   transactionIndex: ' +
              e.transactionIndex +
              '\n' +
              '   from            : ' +
              e.from +
              '\n' +
              '   to              : ' +
              e.to +
              '\n' +
              '   value           : ' +
              e.value +
              '\n' +
              '   time            : ' +
              block.timestamp +
              ' ' +
              new Date(block.timestamp * 1000).toGMTString() +
              '\n' +
              '   gasPrice        : ' +
              e.gasPrice +
              '\n' +
              '   gas             : ' +
              e.gas +
              '\n' +
              '   input           : ' +
              e.input
          );
        }
      });
    }
  }
}

const getTrans = async () => {
  const wallet2 = await web3.eth.accounts.wallet.add(
    '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
  );

  const balance = web3.utils.fromWei(
    await web3.eth.getBalance(wallet2.address),
    'ether'
  );

  console.log('Ether balance wallet 2: ' + balance);

  const transactions = await getTransactionsByAccount(wallet2.address);
  console.log(transactions);
};

try {
  getTrans();
} catch (error) {
  console.log(error);
}

/*
*
*
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
        .on('transactionHash', console.log);*

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
*
*
*/
