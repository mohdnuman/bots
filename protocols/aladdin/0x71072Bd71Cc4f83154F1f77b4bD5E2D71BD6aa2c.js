const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const config = require("../../config.json");
const Twitter = require("twitter");
const abi = require("./0x71072Bd71Cc4f83154F1f77b4bD5E2D71BD6aa2c.json");

const client = new Twitter({
  consumer_key: "Rx8eJ7JjzWO5dC2lSQOpqMKOo",
  consumer_secret: "0G7pIgEIxiOcbhFFn7nEmmDeXXYy8ih88Xg0UiCYqMSIgp8AfH",
  access_token_key: "1577611183623766017-0mXmk5dwZeh0yzOIkswRZvgLAMksQT",
  access_token_secret: "VEPPrh4sRpOZ36W8ZTG3G0RK8ZsNieCH3IQt5rOKysEZ9",
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
