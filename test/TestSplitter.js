const Promise = require("bluebird");
const Splitter = artifacts.require("./Splitter.sol");

Promise.promisifyAll(web3.eth, { suffix: "Promise" });

contract('Splitter', (accounts) => {
  const owner = accounts[0];
  const receiver1 = accounts[2];
  const receiver2 = accounts[3];

  beforeEach(() => {
    return Splitter.new({ from: owner })
    .then((instance) => {
      contractInstance = instance;
    });
  });

  it("Should set owner", () => {
    return contractInstance.owner({from: owner})
    .then((result) => {
      assert.strictEqual(result, owner, "contract owner isn't deployer");
    });
  });

  it("split sent ether", () => {
    const sendAmount = 100;

    return contractInstance.splitPayment(receiver1, receiver2, {from: owner, value: sendAmount})
    .then((result) => {
      assert.equal(result.receipt.status, true, "splitPaymemnt error");
      return contractInstance.splitAmounts.call(receiver1, {from: owner});
    })
    .then((result) => {
      assert.strictEqual(result.toString(10), (sendAmount / 2).toString(10), "incorrect amount");
      return contractInstance.splitAmounts.call(receiver2, {from: owner});
    })
    .then((result) => {
      assert.strictEqual(result.toString(10), (sendAmount / 2).toString(10), "incorrect amount");
    });
  });

  describe("withdrawal check", () => {
    beforeEach("Run the split", () => {
      const sendAmount = 100;
      return contractInstance.splitMembers(receiver1, receiver2, {from: owner, value: sendAmount});
    })

    it("should withdraw from balances", () => {
      var hash;
      var gasPrice = 0;
      var gasUsed = 0;
      var txFee = 0;
      var sendAmount = 1000;
      var receiveAmount = 0;
      var balanceBefore;
      var balanceNow;

      return new Promise((resolve, reject) => {
        web3.eth.getBalance(receiver1, (err, balance) => {
          err ? reject(err) : resolve(balance);
        });
      })
      .then((balance) => {
        balanceBefore = balance;
        return contractInstance.requestWithdraw({from: receiver1});
      })
      .then((txObj) => {
        hash = txObj.receipt.transactionHash;
        gasUsed = txObj.receipt.gasUsed;
        return web3.eth.getTransactionPromise(hash);
      })
      .then((tx) => {
        gasPrice = tx.gasPrice;
        return web3.eth.getBalancePromise(receiver1);
      })
      .then((balance) => {
        balanceNow = balance;
        receiveAmount = sendAmount / 2;
        txFee = gasUsed * gasPrice;
        assert.strictEqual(balanceNow.toString(10), balanceBefore.plus(receiveAmount).minus(txFee).toString(10), "wrong balance");
      });
    });
  });
});