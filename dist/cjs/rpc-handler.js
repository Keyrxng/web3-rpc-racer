"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const providers_1 = require("@ethersproject/providers");
const constants_1 = require("./constants");
class RPCHandler {
  constructor(networkId) {
    this._env = "node" || "browser";
    this._rpcBody = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: ["latest", false],
      id: 1,
    });
    this._rpcHeader = {
      "Content-Type": "application/json",
    };
    this._localHost = "http://127.0.0.1:8545";
    this._networkId = networkId;
    this._runtimeRpcs = constants_1.networkRpcs[networkId];
    // connect to the Ubiquity RPC by default
    this._provider = new providers_1.JsonRpcProvider(this._runtimeRpcs[0], {
      name: this._runtimeRpcs[0],
      chainId: this._networkId,
    });
    this._env = typeof window === "undefined" ? "node" : "browser";
    if (this._env === "browser") {
      this._latencies = JSON.parse(localStorage.getItem("rpcLatencies") || "{}");
      this._refreshLatencies = JSON.parse(localStorage.getItem("refreshLatencies") || "0");
    } else {
      this._latencies = {};
      this._refreshLatencies = 0;
    }
    this._init().catch(this._handleError);
  }
  /**
   * @notice - Spawns a new instance or returns the current one
   *         - Invokes _init(), testing the latencies of each RPC
   *         - Saves the latencies to localStorage if in a browser environment
   *         - Returns the fastest RPC provider
   *
   *         - To reset or retest the latencies, call getFastestRpcProvider(<networkId>)
   *         - this will return the fastest RPC provider for the given network
   *         - testing only the previously cached RPCs
   *
   *         - Calling testRpcPerformance(<networkId>) will test all RPCs again
   *         - which will update the cache but return nothing directly
   *
   * @param networkId the id of the network
   * @returns {RPCHandler} - The instance of the RPCHandler
   */
  static getInstance(networkId) {
    if (!RPCHandler._instance) {
      RPCHandler._instance = new RPCHandler(networkId);
    }
    return RPCHandler._instance;
  }
  /**
   * @returns {JsonRpcProvider} - The current provider of the RPCHandler
   */
  getProvider() {
    return this._provider;
  }
  /**
   * @notice - Clears the instance of the RPCHandler
   * @returns {void} - Nothing
   */
  clearInstance() {
    RPCHandler._instance = null;
  }
  /**
   * @notice - Clears the latencies from both localStorage and the instance
   * @returns {void} - Nothing
   */
  clearLatencies() {
    this._env === "browser" && localStorage.removeItem("rpcLatencies");
    this._env === "node" && (this._latencies = {});
  }
  /**
   * @notice - Clears the refresh latencies from both localStorage and the instance
   * @returns {void} - Nothing
   */
  clearRefreshLatencies() {
    this._env === "browser" && localStorage.removeItem("refreshLatencies");
    this._env === "node" && (this._refreshLatencies = 0);
  }
  /**
   * @notice - networkId === 31337 is for testing permits/wanting no ext RPC calls
   *         - not called directly by the UI code but good for node
   *         - retests RPCs and directly returns an upto date provider
   *
   * @dev - 5 cycles and it'll update it's cache by testing all RPCs again
   * @returns {JsonRpcProvider} - The fastest RPC provider
   */
  async getFastestRpcProvider(networkId) {
    if (!networkId) {
      networkId = this._networkId;
    }
    if (networkId === 31337) {
      return new providers_1.JsonRpcProvider(this._localHost, {
        name: this._localHost,
        chainId: 31337,
      });
    }
    // test first, we've set the latencies already or we haven't and this will
    await this.testRpcPerformance(networkId).catch(this._handleError);
    // grab our newly tested latencies
    // const latencies: Record<string, number> = JSON.parse(localStorage.getItem("rpcLatencies") || "{}");
    let latencies = this._latencies;
    if (this._env === "browser") {
      latencies = JSON.parse(localStorage.getItem("rpcLatencies") || "{}");
    }
    // filter out latencies that do not belong to the desired network
    const validLatencies = Object.entries(latencies)
      .filter(([rpc]) => rpc.endsWith(`_${networkId}`))
      .map(([rpc, latency]) => [rpc.split("_")[0], latency]);
    // Sort the latencies and get the fastest RPC
    const sortedLatencies = validLatencies.sort((a, b) => a[1] - b[1]);
    const optimalRPC = sortedLatencies[0][0];
    return new ethers_1.ethers.providers.JsonRpcProvider(optimalRPC, {
      name: optimalRPC,
      chainId: networkId,
    });
  }
  /**
   * @notice - Tests the performance of each RPC
   *         - it cycles back and try all RPCs again after 5 cycles
   *         - it saves the latencies to localStorage if in a browser environment
   *         - it updates the latencies of the instance
   *
   * @param networkId the id of the network
   * @returns {Promise<void>} - A promise that resolves when all RPCs have been tested
   */
  async testRpcPerformance(networkId) {
    const shouldRefreshRpcs = Object.keys(this._latencies).filter((rpc) => rpc.endsWith(`_${networkId}`)).length <= 1 || this._refreshLatencies >= 5;
    this._refreshLatencies++;
    if (shouldRefreshRpcs) {
      this._refreshLatencies = 0;
    }
    this._env === "browser" && this._saveRefreshLatenciesToLocalStorage().catch(this._handleError);
    // use all the rpcs for the first pass or after 5 refreshes
    this._runtimeRpcs = shouldRefreshRpcs
      ? constants_1.networkRpcs[networkId]
      : // use cached otherwise
        Object.keys(this._latencies).map((rpc) => {
          if (rpc.includes("api_key") && rpc.endsWith(`_${networkId}`)) {
            return rpc.replace(`_${networkId}`, "");
          }
          return rpc.split("_")[0];
        });
    const promises = this._runtimeRpcs.map(async (baseURL) => {
      if (baseURL === "") {
        return;
      }
      const startTime = performance.now();
      const API = axios_1.default.create({
        baseURL,
        headers: this._rpcHeader,
        cancelToken: new axios_1.default.CancelToken((c) => {
          setTimeout(() => c("Request Timeout"), 500); // could increase this but I don't see why we would
        }),
      });
      const { data } = await API.post("", this._rpcBody);
      const endTime = performance.now();
      const latency = endTime - startTime;
      if (this._verifyBlock(data)) {
        this._latencies[`${baseURL}_${networkId}`] = latency;
        this._env === "browser" && this._saveLatenciesToLocalStorage().catch(this._handleError);
      } else {
        // Throw an error to indicate an invalid block data
        throw new Error(`Invalid block data from ${baseURL}`);
      }
    });
    await this._raceUntilSuccess(promises);
  }
  async _init() {
    this._provider = await this.getFastestRpcProvider(this._networkId);
  }
  /**
   * @param promises the unresolved promises
   * @param latencies the current latencies
   * @param runtimeRpcs the current runtime RPCs
   * @returns {Promise<unknown>} - A promise that resolves when each promise has been resolved
   */
  async _raceUntilSuccess(promises) {
    return new Promise((resolve) => {
      promises.forEach((promise, i) => {
        promise.then(resolve).catch(() => {
          // delete the rpc that failed then save again so the next iteration will not use it
          delete this._latencies[this._runtimeRpcs[i]];
          delete this._runtimeRpcs[i];
          this._env === "browser" && this._saveLatenciesToLocalStorage().catch(this._handleError);
        });
      });
    });
  }
  /**
   * @notice - Verifies the block data from the RPC call
   * @param data the payload from the RPC call
   * @returns {Promise<boolean>} - A boolean indicating if the block data is valid
   */
  _verifyBlock(data) {
    try {
      const { jsonrpc, id, result } = data;
      const { number, timestamp, hash } = result;
      return (
        jsonrpc === "2.0" && id === 1 && parseInt(number, 16) > 0 && parseInt(timestamp, 16) > 0 && hash.match(/[0-9|a-f|A-F|x]/gm)?.join("").length === 66
      );
    } catch (error) {
      return false;
    }
  }
  /**
   * @notice - Saves the latencies to localStorage
   * @dev - used in a browser environment
   * @returns {Promise<void>} - A promise that resolves when the latencies have been saved
   */
  async _saveLatenciesToLocalStorage() {
    localStorage.setItem("rpcLatencies", JSON.stringify(this._latencies));
  }
  /**
   * @notice - Saves the refresh latencies to localStorage
   * @dev - used in a browser environment
   * @returns {Promise<void>} - A promise that resolves when the refresh latencies have been saved
   */
  async _saveRefreshLatenciesToLocalStorage() {
    localStorage.setItem("refreshLatencies", JSON.stringify(this._refreshLatencies));
  }
  /**
   * @param error the error to be handled
   */
  _handleError(error) {
    console.error(error);
  }
}
exports.RPCHandler = RPCHandler;
RPCHandler._instance = null;
