const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', (accounts) => {
  const [owner, receiver1, receiver2] = accounts;
  let contractInstance;

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
    assert.isTrue(res1.receipt.status, "splitPayment error");

    const res2 = contractInstance.balances.call(receiver1, { from: owner });
    assert.strictEqual(res2.toString(10), "50", "incorrect amount");

    const res3 = contractInstance.balances.call(receiver2, { from: owner });
    assert.strictEqual(res3.toString(10), "50", "incorrect amount");
  });

  describe("withdrawal check", () => {
    beforeEach("split", () => {
      const sendAmount = 100;
      return contractInstance.splitPayment(receiver1, receiver2, {from: owner, value: sendAmount});
    })

    it("should withdraw from balances", async () => {
      let gasPrice = 0;
      let gasUsed = 0;
      let txFee = 0;
      let receiveAmount = 0;
      let balanceBefore;
      let balanceNow;

      const receiver1Balance = await web3.eth.getBalance(receiver1);
      balanceBefore = receiver1Balance;

      const txObj = await contractInstance.withdrawPayment({ from: receiver1 });
      const hash = txObj.receipt.transactionHash;
      gasUsed = txObj.receipt.gasUsed;
      const log = txObj.logs[0];

      const tx = await web3.eth.getTransactionPromise(hash);
      gasPrice = tx.gasPrice;

      const balance = await web3.eth.getBalancePromise(receiver1);
      balanceNow = balance;
      receiveAmount = 50;
      txFee = gasUsed * gasPrice;

      const newReceiverOneContractBalance = await contractInstance.getAddressBalance(receiver1);
      
      assert.strictEqual(balanceNow.toString(10), balanceBefore.plus(receiveAmount).minus(txFee).toString(10), "wrong balance");
      assert.strictEqual(newReceiverOneContractBalance.toString(10), "0", "did not withdraw full balance");
      assert.strictEqual(log.event, "PaymentWithdrawn");
    });
  });
});