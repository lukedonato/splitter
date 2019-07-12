const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', (accounts) => {
  const [owner, receiver1, receiver2] = accounts;

  beforeEach(async () => {
    contractInstance = await Splitter.new({ from: owner });
  });

  it("Should set owner", async () => {
    const owner = await contractInstance.owner({ from: owner });

    assert.strictEqual(result, owner, "contract owner isn't deployer");
  });

  it("split sent ether", async () => {
    const sendAmount = 100;

    const res1 = contractInstance.splitPayment(receiver1, receiver2, { from: owner, value: sendAmount });
    assert.equal(res1.receipt.status, true, "splitPaymemnt error");

    const res2 = contractInstance.balances.call(receiver1, { from: owner });
    assert.strictEqual(res2.toString(10), (sendAmount / 2).toString(10), "incorrect amount");

    const res3 = contractInstance.balances.call(receiver2, { from: owner });
    assert.strictEqual(res3.toString(10), (sendAmount / 2).toString(10), "incorrect amount");
  });

  describe("withdrawal check", () => {
    beforeEach("split", () => {
      const sendAmount = 100;
      return contractInstance.splitPayment(receiver1, receiver2, {from: owner, value: sendAmount});
    })

    it("should withdraw from balances", async () => {
      var hash;
      var gasPrice = 0;
      var gasUsed = 0;
      var txFee = 0;
      var sendAmount = 1000;
      var receiveAmount = 0;
      var balanceBefore;
      var balanceNow;

      const receiver1Balance = await web3.eth.getBalance(receiver1);
      balanceBefore = receiver1Balance;

      const txObj = await contractInstance.withdrawPayment({ from: receiver1 });
      hash = txObj.receipt.transactionHash;
      gasUsed = txObj.receipt.gasUsed;

      const tx = await web3.eth.getTransactionPromise(hash);
      gasPrice = tx.gasPrice;

      const balance = await web3.eth.getBalancePromise(receiver1);
      balanceNow = balance;
      receiveAmount = sendAmount / 2;
      txFee = gasUsed * gasPrice;
      
      assert.strictEqual(balanceNow.toString(10), balanceBefore.plus(receiveAmount).minus(txFee).toString(10), "wrong balance");
    });
  });
});