const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const config = require("../../config.json");
const Twitter = require("twitter");
const abi = require("./0x2b591e99afe9f32eaa6214f7b7629768c40eeb39.json");

const client = new Twitter({
  consumer_key: "Rx8eJ7JjzWO5dC2lSQOpqMKOo",
  consumer_secret: "0G7pIgEIxiOcbhFFn7nEmmDeXXYy8ih88Xg0UiCYqMSIgp8AfH",
  access_token_key: "1577611183623766017-0mXmk5dwZeh0yzOIkswRZvgLAMksQT",
  access_token_secret: "VEPPrh4sRpOZ36W8ZTG3G0RK8ZsNieCH3IQt5rOKysEZ9",
});

const contractAddress = config.protocols.hex.address;

const contract = new Contract(contractAddress, abi, provider);

const main = async () => {
  console.log(
    `Protocol tracker statrted! \nListening for interactions on hex protocol`
  );

  contract.on("StakeStart", async (data0,userAddress, stakeId, trxData) => {
    let amount;
    let stakeCount = await contract.stakeCount(userAddress);
    for (let i = 0; i < stakeCount; i++) {
      let stake = await contract.stakeLists(userAddress, i);
      if (stake.stakeId === stakeId) {
        amount = stake;
      }
    }
    amount = (amount.stakedHearts / 10 ** 8).toFixed(2);
    client.post(
      "statuses/update",
      {
        status: `${userAddress} staked ${amount} HEX in hex protocol
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
