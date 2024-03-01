// declaring it here so it's surely passed in at build time

const extraRpcs: Record<string, string[]> = {}; // @DEV: passed in at build time check build/esbuild-build.ts

export { extraRpcs };
