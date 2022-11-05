import Generator from "../generateTree";
import MerkleTree from "merkletreejs";

const sampleData = {
  "0x0000000000000000000000000000000000000001": 1,
  "0x0000000000000000000000000000000000000002": 1,
  "0x0000000000000000000000000000000000000003": 1,
  "0x0000000000000000000000000000000000000004": 1,
  "0x0000000000000000000000000000000000000005": 1,
};

const run = async () => {
  const gen = new Generator(2, sampleData);
  const { root, tree } = await gen.generateMerkleData();
  const l1 = gen.generateLeaf(
    "0x0000000000000000000000000000000000000001",
    "100"
  );
  const l2 = gen.generateLeaf(
    "0x0000000000000000000000000000000000000005",
    "100"
  );

  console.log(
    root,
    { "0x0000000000000000000000000000000000000001": tree.getHexProof(l1) },
    { "0x0000000000000000000000000000000000000005": tree.getHexProof(l2) }
  );
};

run().then();
