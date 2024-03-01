import { HandlerInterface } from "./types/handler";
import { JsonRpcProvider } from "@ethersproject/providers";
export declare class RPCHandler implements HandlerInterface {
  private static _instance;
  private _provider;
  _networkId: number;
  _refreshLatencies: number;
  _latencies: Record<string | number, number>;
  _runtimeRpcs: string[];
  _env: string;
  private _rpcBody;
  private _rpcHeader;
  private _localHost;
  constructor(networkId: number);
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
  static getInstance(networkId: number): RPCHandler;
  /**
   * @returns {JsonRpcProvider} - The current provider of the RPCHandler
   */
  getProvider(): JsonRpcProvider;
  /**
   * @notice - Clears the instance of the RPCHandler
   * @returns {void} - Nothing
   */
  clearInstance(): void;
  /**
   * @notice - Clears the latencies from both localStorage and the instance
   * @returns {void} - Nothing
   */
  clearLatencies(): void;
  /**
   * @notice - Clears the refresh latencies from both localStorage and the instance
   * @returns {void} - Nothing
   */
  clearRefreshLatencies(): void;
  /**
   * @notice - networkId === 31337 is for testing permits/wanting no ext RPC calls
   *         - not called directly by the UI code but good for node
   *         - retests RPCs and directly returns an upto date provider
   *
   * @dev - 5 cycles and it'll update it's cache by testing all RPCs again
   * @returns {JsonRpcProvider} - The fastest RPC provider
   */
  getFastestRpcProvider(networkId?: number): Promise<JsonRpcProvider>;
  /**
   * @notice - Tests the performance of each RPC
   *         - it cycles back and try all RPCs again after 5 cycles
   *         - it saves the latencies to localStorage if in a browser environment
   *         - it updates the latencies of the instance
   *
   * @param networkId the id of the network
   * @returns {Promise<void>} - A promise that resolves when all RPCs have been tested
   */
  testRpcPerformance(networkId: number): Promise<void>;
  _init(): Promise<void>;
  /**
   * @param promises the unresolved promises
   * @param latencies the current latencies
   * @param runtimeRpcs the current runtime RPCs
   * @returns {Promise<unknown>} - A promise that resolves when each promise has been resolved
   */
  private _raceUntilSuccess;
  /**
   * @notice - Verifies the block data from the RPC call
   * @param data the payload from the RPC call
   * @returns {Promise<boolean>} - A boolean indicating if the block data is valid
   */
  private _verifyBlock;
  /**
   * @notice - Saves the latencies to localStorage
   * @dev - used in a browser environment
   * @returns {Promise<void>} - A promise that resolves when the latencies have been saved
   */
  private _saveLatenciesToLocalStorage;
  /**
   * @notice - Saves the refresh latencies to localStorage
   * @dev - used in a browser environment
   * @returns {Promise<void>} - A promise that resolves when the refresh latencies have been saved
   */
  private _saveRefreshLatenciesToLocalStorage;
  /**
   * @param error the error to be handled
   */
  private _handleError;
}
