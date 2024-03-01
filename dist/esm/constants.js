import { extraRpcs } from "./extraRpcs";
export var NetworkIds;
(function (NetworkIds) {
  NetworkIds[(NetworkIds["Mainnet"] = 1)] = "Mainnet";
  NetworkIds[(NetworkIds["Goerli"] = 5)] = "Goerli";
  NetworkIds[(NetworkIds["Gnosis"] = 100)] = "Gnosis";
  NetworkIds[(NetworkIds["Anvil"] = 31337)] = "Anvil";
})(NetworkIds || (NetworkIds = {}));
export var Tokens;
(function (Tokens) {
  Tokens["DAI"] = "0x6b175474e89094c44da98b954eedeac495271d0f";
  Tokens["WXDAI"] = "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d";
})(Tokens || (Tokens = {}));
export const networkNames = {
  [NetworkIds.Mainnet]: "Ethereum Mainnet",
  [NetworkIds.Goerli]: "Goerli Testnet",
  [NetworkIds.Gnosis]: "Gnosis Chain",
  [NetworkIds.Anvil]: "http://127.0.0.1:8545",
};
export const networkCurrencies = {
  [NetworkIds.Mainnet]: { symbol: "ETH", decimals: 18 },
  [NetworkIds.Goerli]: { symbol: "GoerliETH", decimals: 18 },
  [NetworkIds.Gnosis]: { symbol: "XDAI", decimals: 18 },
  [NetworkIds.Anvil]: { symbol: "XDAI", decimals: 18 },
};
export function getNetworkName(networkId) {
  const networkName = networkNames[networkId];
  if (!networkName) {
    console.error(`Unknown network ID: ${networkId}`);
  }
  return networkName ?? "Unknown Network";
}
export const networkExplorers = {
  [NetworkIds.Mainnet]: "https://etherscan.io",
  [NetworkIds.Goerli]: "https://goerli.etherscan.io",
  [NetworkIds.Gnosis]: "https://gnosisscan.io",
  [NetworkIds.Anvil]: "https://gnosisscan.io",
};
// for tests
if (typeof extraRpcs !== "object") {
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
export const networkRpcs = {
  [NetworkIds.Mainnet]: ["https://rpc-pay.ubq.fi/v1/mainnet", ...(extraRpcs[NetworkIds.Mainnet] || [])],
  [NetworkIds.Goerli]: ["https://rpc-pay.ubq.fi/v1/goerli", ...(extraRpcs[NetworkIds.Goerli] || [])],
  [NetworkIds.Gnosis]: ["https://rpc.ankr.com/gnosis", ...(extraRpcs[NetworkIds.Gnosis] || [])],
  [NetworkIds.Anvil]: ["http://127.0.0.1:8545"],
};
export const permit2Address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
export const nftAddress = "0xAa1bfC0e51969415d64d6dE74f27CDa0587e645b";
