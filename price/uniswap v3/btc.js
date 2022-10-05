const rpcURL = "https://cloudflare-eth.com/";
const config = require("../../config.json");
const Twitter = require("twitter");
const abi = require("./abi.json");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

const client = new Twitter({
  consumer_key: "nZ2svFKO1dDiogksJNhH05u76",
  consumer_secret: "20h8F6WayuYcpEdVgaGo8AN3DflQV2RE6p3OuFIqGlMEQ2D5CH",
  access_token_key: "1486096407299694593-xXHWqu7N6TwABsNyh17Xbw3Mwnjmyv",
  access_token_secret: "3Ep5A6hUOTZyy77thXudXKO0r5UzT4hE41imlxlQQnFqZ",
});

async function getPrice() {
  let contractAddress = config.price.uniswapv3.btcusd;
  let contract = new web3.eth.Contract(abi, contractAddress);

  let slot0 = await contract.methods.slot0().call();
  let sqrtPrice = slot0.sqrtPriceX96;
  let price = ((sqrtPrice ** 2/2 ** 192 )*10**2).toFixed(2);
  let date=new Date();
  date=date.toUTCString();

  client.post(
    "statuses/update",
    {
      status: `${date} BTC/USD price on uniswap v3: ${price}$`,
    },
    function (error, tweet, response) {
      if (error) throw error;
      console.log(`new btcusd price update!`);
    }
  );
}

setInterval(() => {
  getPrice();
}, 600000);
