const rpcURL = "https://cloudflare-eth.com/";
const config = require("../../config.json");
const Twitter = require("twitter");
const abi = require("./abi.json");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

const client = new Twitter({
  consumer_key: "gw6si8pyPZsQxLdOweoWBsHAs",
  consumer_secret: "a5A7GsQeapWD2McQFkDblfcEfKkAf4j6tkAsutxmxW3npi9MK4",
  access_token_key: "1577600944446918657-U0XPHUc6By2vk02MJQOJtH2wIFxdiI",
  access_token_secret: "siOdq27nIq947F1qGeBE0DHZo6ZN5Vaivp8Wjnd5Y40kW",
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
      status: `[${date}] BTC/USD price on uniswap v3: ${price}$`,
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
