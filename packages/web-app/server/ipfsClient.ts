import { create } from "ipfs-http-client";

export const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.IPFS_NODE_USERNAME}:${process.env.IPFS_NODE_PASSWORD}`
    ).toString("base64")}`,
  },
});
