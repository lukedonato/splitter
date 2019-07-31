require("file-loader?name=./index.html!./index.html");
const Web3 = require("web3");
const Promise = require("bluebird");
const truffleContract = require("truffle-contract");
const $ = require("jquery");
// Not to forget our built contract
const splitterJson = require("../build/contracts/Splitter.json");

const printReceipt = (receipt) => {
    if (!receipt.status) {
        console.error(receipt);
    } else if (receipt.logs.length === 0) {
        console.error(receipt);
    } else {
        console.log(receipt.logs[0]);
    }
};

if (typeof web3 !== 'undefined') {
    // Use the Mist/wallet/Metamask provider.
    window.web3 = new Web3(web3.currentProvider);
} else {
    // Your preferred fallback.
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

const Splitter = truffleContract(splitterJson);
Splitter.setProvider(web3.currentProvider);

let account;

window.addEventListener('load', async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        if (!accounts.length) {
            throw new Error('No account with which to transact');
        }

        account = accounts[0];

        $("#split").click(split);
        $("#withdraw").click(withdraw);
        $("#get-balance").click(getBalance);
    } catch (err) {
        console.error(err);
    }
});

async function split() {
    try {
        const recipient1 = $('#recipient-1').val();
        const recipient2 = $('#recipient-2').val();
        const value = web3.utils.toWei($('#split-input').val());
        const splitter = await Splitter.deployed();

        // simulate split
        assert(await splitter.splitPayment.call(
            recipient1,
            recipient2,
            { from: account, value }
        ), 'transaction will fail');

        const tx = await splitter.splitPayment(
            recipient1,
            recipient2,
            { from: account, value }
        )
        .on(
            'transactionHash',
            () => $('#split-status').html('transaction sent')
        );
        
        printReceipt(tx.receipt);

        if (tx.receipt.logs[0]) {
            $('#split-status').html('transaction succeeded');
        } else {
            $('#split-status').html('transaction failed');
        }
    } catch (err) {
        console.error(err);
    }
}

async function withdraw() {
    try {
        const splitter = await Splitter.deployed();

        const tx = await splitter.withdrawPayment({ from: account });

        printReceipt(tx.receipt);
    } catch (err) {
        console.error(err);
    }
}

async function getBalance() {
    try {
        const checkAddress = $('#check-address').val();
        const splitter = await Splitter.deployed();

        const checkBalance = web3.utils.fromWei(await splitter.balances(checkAddress));

        $('#check-balance').html(checkBalance.toString(10));
    } catch (err) {
        console.error(err);
    }
}

