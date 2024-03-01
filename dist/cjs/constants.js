"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftAddress =
  exports.permit2Address =
  exports.networkRpcs =
  exports.networkExplorers =
  exports.getNetworkName =
  exports.networkCurrencies =
  exports.networkNames =
  exports.Tokens =
  exports.NetworkIds =
    void 0;
const extraRpcs_1 = require("./extraRpcs");
var NetworkIds;
(function (NetworkIds) {
  NetworkIds[(NetworkIds["Mainnet"] = 1)] = "Mainnet";
  NetworkIds[(NetworkIds["Goerli"] = 5)] = "Goerli";
  NetworkIds[(NetworkIds["Gnosis"] = 100)] = "Gnosis";
  NetworkIds[(NetworkIds["Anvil"] = 31337)] = "Anvil";
})(NetworkIds || (exports.NetworkIds = NetworkIds = {}));
var Tokens;
(function (Tokens) {
  Tokens["DAI"] = "0x6b175474e89094c44da98b954eedeac495271d0f";
  Tokens["WXDAI"] = "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d";
})(Tokens || (exports.Tokens = Tokens = {}));
exports.networkNames = {
  [NetworkIds.Mainnet]: "Ethereum Mainnet",
  [NetworkIds.Goerli]: "Goerli Testnet",
  [NetworkIds.Gnosis]: "Gnosis Chain",
  [NetworkIds.Anvil]: "http://127.0.0.1:8545",
};
exports.networkCurrencies = {
  [NetworkIds.Mainnet]: { symbol: "ETH", decimals: 18 },
  [NetworkIds.Goerli]: { symbol: "GoerliETH", decimals: 18 },
  [NetworkIds.Gnosis]: { symbol: "XDAI", decimals: 18 },
  [NetworkIds.Anvil]: { symbol: "XDAI", decimals: 18 },
};
function getNetworkName(networkId) {
  const networkName = exports.networkNames[networkId];
  if (!networkName) {
    console.error(`Unknown network ID: ${networkId}`);
  }
  return networkName ?? "Unknown Network";
}
exports.getNetworkName = getNetworkName;
exports.networkExplorers = {
  [NetworkIds.Mainnet]: "https://etherscan.io",
  [NetworkIds.Goerli]: "https://goerli.etherscan.io",
  [NetworkIds.Gnosis]: "https://gnosisscan.io",
  [NetworkIds.Anvil]: "https://gnosisscan.io",
};
// for tests
if (typeof extraRpcs_1.extraRpcs !== "object") {
  const extraRpcs = {};
  extraRpcs[100] = [
    "https://rpc.gnosischain.com",
    "https://xdai-archive.blockscout.com",
    "https://gnosis-pokt.nodies.app",
    "https://gnosis.drpc.org",
    "https://endpoints.omniatech.io/v1/gnosis/mainnet/public",
    "https://gnosis.publicnode.com",
    "wss://gnosis.publicnode.com",
    "https://rpc.tornadoeth.cash/gnosis",
  ];
}
exports.networkRpcs = {
  [NetworkIds.Mainnet]: ["https://rpc-pay.ubq.fi/v1/mainnet", ...(extraRpcs_1.extraRpcs[NetworkIds.Mainnet] || [])],
  [NetworkIds.Goerli]: ["https://rpc-pay.ubq.fi/v1/goerli", ...(extraRpcs_1.extraRpcs[NetworkIds.Goerli] || [])],
  [NetworkIds.Gnosis]: ["https://rpc.ankr.com/gnosis", ...(extraRpcs_1.extraRpcs[NetworkIds.Gnosis] || [])],
  [NetworkIds.Anvil]: ["http://127.0.0.1:8545"],
};
exports.permit2Address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
exports.nftAddress = "0xAa1bfC0e51969415d64d6dE74f27CDa0587e645b";
