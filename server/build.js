import { build } from "esbuild";

build({
  entryPoints: ["./server.mjs"],
  bundle: true,
  platform: "node",
  target: "node16", // Adjust this to your Node.js link version if needed (https://node.green/)
  outfile: "./dist/server.js",
  format: "esm", // Set the output format to "esm or cjs"
  external: ["mock-aws-s3", "aws-sdk", "nock"], // Mark these dependencies as external
  loader: {
    ".html": "file", // Add loader for .html files
  },
}).catch(() => process.exit(1));
