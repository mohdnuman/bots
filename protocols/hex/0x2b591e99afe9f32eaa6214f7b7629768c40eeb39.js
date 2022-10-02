const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const config = require("../../config.json");
const Twitter = require("twitter");
const abi = require("./0x2b591e99afe9f32eaa6214f7b7629768c40eeb39.json");

const client = new Twitter({
  consumer_key: "nZ2svFKO1dDiogksJNhH05u76",
  consumer_secret: "20h8F6WayuYcpEdVgaGo8AN3DflQV2RE6p3OuFIqGlMEQ2D5CH",
  access_token_key: "1486096407299694593-xXHWqu7N6TwABsNyh17Xbw3Mwnjmyv",
  access_token_secret: "3Ep5A6hUOTZyy77thXudXKO0r5UzT4hE41imlxlQQnFqZ",
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

  contract.on("StakeEnd", async (data0,data1,userAddress, stakeId, trxData) => {
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
        status: `${userAddress} unstaked ${amount} HEX from hex protocol
        https://etherscan.io/tx/${trxData.transactionHash}`,
      },
      function (error, tweet, response) {
        if (error) throw error;
        console.log(`new HEX unstake!`);
      }
    );
  });
};

main();
