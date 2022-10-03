const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const config = require("../../config.json");
const Twitter = require("twitter");
const abi = require("./0x71072Bd71Cc4f83154F1f77b4bD5E2D71BD6aa2c.json");

const client = new Twitter({
  consumer_key: "nZ2svFKO1dDiogksJNhH05u76",
  consumer_secret: "20h8F6WayuYcpEdVgaGo8AN3DflQV2RE6p3OuFIqGlMEQ2D5CH",
  access_token_key: "1486096407299694593-xXHWqu7N6TwABsNyh17Xbw3Mwnjmyv",
  access_token_secret: "3Ep5A6hUOTZyy77thXudXKO0r5UzT4hE41imlxlQQnFqZ",
});

const contractAddress = config.protocols.aladdin.addresses[0];

const contract = new Contract(contractAddress, abi, provider);

const main = async () => {
  console.log(
    `Protocol tracker statrted! \nListening for interactions on aladdin protocol`
  );

  contract.on("Stake", async (userAddress,recipient,amount, trxData) => {
    amount=amount/10**18;
    client.post(
      "statuses/update",
      {
        status: `${userAddress} staked ${amount} ALD in aladdin protocol
        https://etherscan.io/tx/${trxData.transactionHash}`,
      },
      function (error, tweet, response) {
        if (error) throw error;
        console.log(`new HEX stake!`);
      }
    );
  });
}

main();
