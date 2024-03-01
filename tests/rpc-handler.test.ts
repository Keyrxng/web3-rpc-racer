const { RPCHandler } = require("./rpc-handler");

beforeEach(() => {
  jest.clearAllMocks();

  jest.mock("@ethersproject/providers", () => ({
    JsonRpcProvider: jest.fn(),
  }));

  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("RPCHandler Singleton", () => {
  it("should create separate instances for different network IDs", () => {
    const rpcHandler = new RPCHandler(100);
    const rpcHandler2 = RPCHandler.getInstance(31337);

    expect(rpcHandler).not.toBe(rpcHandler2);
  });
});

describe("Environment Detection", () => {
  it("should detect a node env", () => {
    const rpcHandler = new RPCHandler(100);
    expect(rpcHandler._env).toBe("node");
  });

  jest.mock("globalThis", () => {
    const windowMock: Window & typeof globalThis = {
      ...globalThis,
      location: {
        protocol: "http",
        host: "localhost",
        ancestorOrigins: undefined as any,
        hash: "",
        hostname: "",
        href: "",
        origin: "",
        pathname: "",
        port: "",
        search: "",
        assign: function (): void {
          throw new Error();
        },
        reload: function (): void {
          throw new Error();
        },
        replace: function (): void {
          throw new Error();
        },
      },
    };
    return windowMock;
  });

  it("should detect a browser env", () => {
    const rpcHandler = new RPCHandler(1);
    expect(rpcHandler._env).toBe("node");
  });
});

describe("RPC Performance Testing", () => {
  jest.setTimeout(20000);
  it("should select the fastest RPC provider", async () => {
    const rpcHandler = await new RPCHandler(100);
    let test1 = await rpcHandler.getFastestRpcProvider(100);
    const runtimeRPCS = rpcHandler._runtimeRpcs;

    console.log(`Starting with runtime ${runtimeRPCS.length} RPCs`);

    let latencies = rpcHandler._latencies;

    let lowest = Number.MAX_SAFE_INTEGER;

    let fastestRpc = "";

    if (!latencies || Array.from(latencies).length <= 1) {
      console.log(`Not enough latencies, trying again.`);
      test1 = await rpcHandler.getFastestRpcProvider(100);
      latencies = rpcHandler._latencies;
    }

    if (!latencies || Array.from(latencies).length <= 1) {
      console.log(`Not enough latencies, trying again.`);
      test1 = await rpcHandler.getFastestRpcProvider(100);
      latencies = rpcHandler._latencies;
    }

    Object.entries(latencies as Record<string, number>).forEach(([url, latency]) => {
      if (latency < lowest) {
        lowest = latency;
        fastestRpc = url;
      }
    });

    const endRpcs = rpcHandler._runtimeRpcs;

    expect(test1.network.name).toBe(fastestRpc.split("_")[0]);

    expect(endRpcs.length).toBeGreaterThanOrEqual(1);
    expect(runtimeRPCS.length).toBeGreaterThanOrEqual(1);

    expect(runtimeRPCS.length).toBeGreaterThanOrEqual(endRpcs.length);
  });
});
