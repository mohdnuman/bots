const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const config = require("../config.json");
const Twitter = require("twitter");
const abi = require("./abi.json");

const client = new Twitter({
  consumer_key: "Rx8eJ7JjzWO5dC2lSQOpqMKOo",
  consumer_secret: "0G7pIgEIxiOcbhFFn7nEmmDeXXYy8ih88Xg0UiCYqMSIgp8AfH",
  access_token_key: "1577611183623766017-0mXmk5dwZeh0yzOIkswRZvgLAMksQT",
  access_token_secret: "VEPPrh4sRpOZ36W8ZTG3G0RK8ZsNieCH3IQt5rOKysEZ9",
});

const contractAddress = config.tokens.usdc.address;

const contract = new Contract(contractAddress, abi, provider);

const TRANSFER_THRESHOLD = config.tokens.usdc.threshold;

const main = async () => {
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  console.log(
    `Whale tracker statrted! \nListening for large transfers on ${name}`
  );

  contract.on("Transfer", (from, to, amount, trxData) => {
    amount = amount.toString();
    if (amount >= TRANSFER_THRESHOLD) {
      let sender = from;
      let receiver = to;

      if (sender == "0x0000000000000000000000000000000000000000") {
        client.post(
          "statuses/update",
          {
            status: ` ${(amount / 10 ** decimals).toFixed(
              2
            )} ${symbol} minted to ${receiver}. https://etherscan.io/tx/${
              trxData.transactionHash
            }`,
          },
          function (error, tweet, response) {
            if (error) throw error;
            console.log(`new ${symbol} mint!`);
          }
        );
      } else if (receiver == "0x0000000000000000000000000000000000000000") {
        client.post(
          "statuses/update",
          {
            status: ` ${(amount / 10 ** decimals).toFixed(
              2
            )} ${symbol} burned by ${sender}. https://etherscan.io/tx/${
              trxData.transactionHash
            }`,
          },
          function (error, tweet, response) {
            if (error) throw error;
            console.log(`new ${symbol} burn!`);
          }
        );
      } else {
        client.post(
          "statuses/update",
          {
            status: `New whale transfer for ${name}: https://etherscan.io/tx/${
              trxData.transactionHash
            } ${(amount / 10 ** decimals).toFixed(
              2
            )} ${symbol} transferred from ${sender} to ${receiver}`,
          },
          function (error, tweet, response) {
            if (error) throw error;
            console.log(`new ${symbol} transfer!`);
          }
        );
      }
    }
  });
};

main();
