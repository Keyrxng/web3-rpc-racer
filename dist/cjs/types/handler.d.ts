import { JsonRpcProvider } from "@ethersproject/providers";
export type DataType = {
  jsonrpc: string;
  id: number;
  result: {
    number: string;
    timestamp: string;
    hash: string;
  };
};
export type HandlerInterface = {
  _networkId: number;
  _refreshLatencies: number;
  _latencies: Record<string | number, number>;
  _runtimeRpcs: string[];
  _env: string;
  getProvider(): JsonRpcProvider;
  clearInstance(): void;
  clearLatencies(): void;
  clearRefreshLatencies(): void;
  getFastestRpcProvider(networkId?: number): Promise<JsonRpcProvider>;
  testRpcPerformance(networkId: number): Promise<void>;
};
