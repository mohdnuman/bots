const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const https = require("https");
const config=require("../config.json");
const Twitter = require("twitter");
const abi = require("./abi.json");


const client = new Twitter({
  consumer_key: "nZ2svFKO1dDiogksJNhH05u76",
  consumer_secret: "20h8F6WayuYcpEdVgaGo8AN3DflQV2RE6p3OuFIqGlMEQ2D5CH",
  access_token_key: "1486096407299694593-xXHWqu7N6TwABsNyh17Xbw3Mwnjmyv",
  access_token_secret: "3Ep5A6hUOTZyy77thXudXKO0r5UzT4hE41imlxlQQnFqZ",
});

const contractAddress = config.tokens.wbtc.address;

const contract = new Contract(contractAddress, abi, provider);

const TRANSFER_THRESHOLD = config.tokens.wbtc.threshold;

const main = async () => {
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals=await contract.decimals();
  console.log(
    `Whale tracker statrted! \nListening for large transfers on ${name}`
  );

  contract.on("Transfer", (from, to, amount, trxData) => {
    amount = amount.toString();
    if (amount >= TRANSFER_THRESHOLD) {
        let sender=from;
        let receiver=to;
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
              console.log("new tweet made!");
            }
          );
    }
  });
};

main();
