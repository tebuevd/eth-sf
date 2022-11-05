
# Merkle Airdop Creator 

## Background

This app allows a token admin / central wallet to create an airdrop for any ERC20 to a pre-specified set of addresses. Once created, a link is generated and any whitelisted user can navigate there to claim their tokens by submitting a merkle proof on-chain.

The admin can also schedule a start time and an end time for the claiming period. Once the end time has passed, the admin can drain the remaining funds allocated for the airdop back into their wallet.

## Tools Used

- [tRPC](https://trpc.io/) 
  - Lighter-weight than GraphQL and provides type safety in APIs with [zod](https://github.com/colinhacks/zod)
- [Next.js](https://nextjs.org/)
  - Quick iteration and easy deployment. SSR was a natural fit for serving the merkle data to the client at claim
- [Typescript](https://www.typescriptlang.org/)
  - Types are based.
- [Foundry](https://github.com/foundry-rs/foundry)
  - Fast iteration and testing of Solidity code.
- [Tailwind](https://tailwindcss.com/)
- [Docker](https://www.docker.com/) 
  - to quickly start the local DB
- [RainbowKit](https://www.rainbowkit.com/)
  -  The vibe-iest way to connect your wallet
-  [Postgres](https://www.postgresql.org/)
   -  To persist the airdrop details. Likely overkill; if I were to do it from scratch I would use something like mongo or a Firebase KV-store.


## Getting Started

### Clone the repos into the same parent directory

```
// http
mkdir magna-project && cd magna-project && git clone https://github.com/Bijan-Massoumi/magna-contracts.git && git clone https://github.com/Bijan-Massoumi/magna-webapp.git

//ssh
mkdir magna-project && cd magna-project && git clone git@github.com:Bijan-Massoumi/magna-contracts.git && git clone git@github.com:Bijan-Massoumi/magna-webapp.git
```

### Start local node, build and deploy the contracts

```
cd magna-contracts

//install deps
npm install
forge install

// start local node
npm run startNode
```

In a separate terminal window, in  `magna-contracts`

```
// build contracts and typechain, deploy
npm run deployLocal
```

 You will see the deployed contract address, copy this and paste it into `/magna-webapp/.env` along with these values

 ```
AIRDROP_CONTRACT=<DEPLOYED_CONTRACT_ADDR>

DATABASE_URL="postgresql://magna:magna@localhost:54320/main?schema=public"

IRON_SESSION_PASSWORD="abcdkdsal;fjkl;jfkladjfkl;dsjfklsadfjaklsdfjdaklsfjsadklfjasdklfjadskl;fjdsaklfjask;lfjadskfj;slfjks"
 ```


Start your local DB
 ```
cd magna-webapp
docker-compose up -d
 ```

Finally, run the development server in a separate tab:

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

### run foundry tests

```
cd magna-contracts
forge test
```

### local webapp testing

Deploy a local test token. This constructor sets a high approval for the default account so the airdrop contract can spend its funds.

```
forge create --rpc-url http://localhost:8545 --private-key '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' src/TestToken.sol:TestToken --constructor-args 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 <AIRDROP_CONTRACT_ADDRESS> 10000000000000000000000000
```

Add this private key to metamask and you should be able to create an airdrop for the token deployed above.
 `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

 Refer to [sample.json](https://github.com/Bijan-Massoumi/magna-webapp/blob/main/sample.json) to see the token distribution JSON schema. A file similar to this must be uploaded into the webapp.


## Improvements To Add Later

- Allow separate airdrop token funder wallet from admin wallet
  - Often the wallet holding the assets for an airdop could be some multisig or vault.

- The total number of tokens allocated for the airdop could potentially be not enough to cover all address claims
  - One possible solution would be computing the root on chain when the airdrop is created, then saving the root.
  - The short term result of not having this check is that users have to do their due diligence and check that enough funds have been allocated.

- Typechain build should pushed to NPM and imported into the webapp rather than committed directly.

- startTime and endTime can be packed into the same uint

- The CreateAirdrop method should confirm that the token address passed to it is a valid ERC20 contract

- The UI should be able to detect an in-flight transaction after a page refresh.
  - This is needed to prevent accidental contract calls

- Token based authentication may have been overkill for the current feature set of the application, I may want to remove it.
- A page to allow the airdrop admin to withdraw their excess funds still needs to be added to the webapp. 
  - The admin needs to call the contract directly currently.

## Discussion

### Why implement the airdop as a claim?

  - Requiring participants to claim filters out passive participants who may not contribute value to the project's ecosystem.
  - Removes the gas burden from the airdrop creator because they dont need to pay for each  `transfer()` call.
    - imo, it is more important to reduce friction on the supply side vs the demand side (the claiming addresses)

### Why use a merkle tree?

- To implement a claim without a merkle tree would require the airdrop creator to push every eligible address to contract storage; this isn't scalable and would likely be more expensive than just transferring the tokens to all addresses.
  - Instead, a merkle tree is constructed with all the eligible addresses as leaves, the root is pushed on-chain and the client constructs a proof when they claim. This proof is then verified in the claim function.

### Why allow for start and end times?
- It is highly likely that not every address will claim their tokens, it is essential to be able to set an end date and to allow the airdrop creator to withdraw excess funds back into a wallet of their choice.

### Why does the amount remaining need to be tracked on the contract per airdrop?

- If the amountRemaining isn't tracked, an admin could potentially drain all the funds from other airdops using the same ERC20 token.

 ## References
- [Merkle airdrop starter](https://github.com/Anish-Agnihotri/merkle-airdrop-starter/blob/master/contracts/src/test/utils/MerkleClaimERC20Test.sol)
  
- [Uniswap merkle distributor](https://github.com/Uniswap/merkle-distributor)
- [Foundry tutorial](https://nader.mirror.xyz/6Mn3HjrqKLhHzu2balLPv4SqE5a-oEESl4ycpRkWFsc)


