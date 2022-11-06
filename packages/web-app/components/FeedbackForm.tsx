import { defaultAbiCoder as abi, solidityPack } from "ethers/lib/utils";
import { VerificationResponse, WorldIDWidget } from "@worldcoin/id";
import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "../utils/trpc";
import { useAccount, useSigner } from "wagmi";
import { Reputation__factory } from "../typechain";
import { BigNumber } from "ethers";

const DEPLOYMENT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function FeedbackForm() {
  const account = useAccount();
  const { data: signer } = useSigner();
  const address = account?.address ?? null;

  const ipfsAdd = trpc.useMutation(["ipfs.add"]);
  const [reviewee, setReviewee] = useState("");
  const [review, setReview] = useState("");
  const [score, setScore] = useState(0);

  const adjustedScore = score * 1000;
  const signal = address;
  const actionId = reviewee;

  const [verificationResponse, setVerificationResponse] =
    useState<VerificationResponse | null>(null);

  const reputation = useMemo(
    () =>
      signer
        ? Reputation__factory.connect(DEPLOYMENT_ADDRESS.toLowerCase(), signer)
        : null,
    [signer]
  );

  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <VStack w={"100%"} spacing="24px">
          <Box w="100%">
            <FormControl className="w-full">
              <FormLabel className="pb-4">{"Reviewee's Address"}</FormLabel>
              <Input
                onChange={(e) => {
                  setReviewee(e.target.value);
                }}
                value={reviewee}
                className="w-full"
                type="text"
              />
            </FormControl>
          </Box>
          <Box w="100%">
            <FormControl className="w-full">
              <FormLabel className="pb-4">Score</FormLabel>
              <Select
                size={"lg"}
                width={"100%"}
                placeholder="Select option"
                onChange={(e) => setScore(+e.target.value)}
                value={score}
              >
                <option value={0.5}>.5</option>
                <option value={1}>1</option>
                <option value={1.5}>1.5</option>
                <option value={2}>2</option>
                <option value={2.5}>2.5</option>
                <option value={3}>3</option>
                <option value={3.5}>3.5</option>
                <option value={4}>4</option>
                <option value={4.5}>4.5</option>
                <option value={5}>5</option>
              </Select>
            </FormControl>
          </Box>
          <Box w="100%">
            <FormControl className="w-full">
              <FormLabel className="pb-4">Review</FormLabel>
              <Textarea
                onChange={(e) => {
                  setReview(e.target.value);
                }}
                height={150}
                value={review}
                className="w-full"
              />
            </FormControl>
          </Box>
          <Box>
            {signal && actionId && (
              <WorldIDWidget
                appName="ETH Global SF"
                actionId={actionId}
                signal={signal}
                signalDescription={`Submit Review for ${reviewee}`}
                onSuccess={(verificationResponse) => {
                  console.log(verificationResponse.nullifier_hash);
                  setVerificationResponse(verificationResponse);
                }}
                onError={(error) => console.error(error)}
                enableTelemetry
                debug
              />
            )}
          </Box>
          <ButtonGroup>
            <Button
              variant={"solid"}
              colorScheme="blue"
              disabled={
                !verificationResponse ||
                !reviewee ||
                !score ||
                !review ||
                !reputation
              }
              onClick={async () => {
                if (
                  !verificationResponse ||
                  !reviewee ||
                  !score ||
                  !review ||
                  !reputation
                ) {
                  return;
                }

                const { merkle_root, nullifier_hash, proof } =
                  verificationResponse!;

                console.log({
                  DEPLOYMENT_ADDRESS,
                });

                const cid = await ipfsAdd.mutateAsync(
                  JSON.stringify({
                    reviewer: address,
                    reviewee,
                    review,
                    score,
                    nullifier: nullifier_hash,
                  })
                );

                const { wait } = await reputation.functions.leaveFeedback(
                  merkle_root,
                  nullifier_hash,
                  abi.decode(["uint256[8]"], proof)[0],
                  BigNumber.from(adjustedScore),
                  cid,
                  actionId
                );
                const res = await wait();
                console.log(res);
              }}
            >
              Submit Review
            </Button>
            <Button variant={"solid"}>Reset</Button>
          </ButtonGroup>
        </VStack>
      </Flex>
    </>
  );
}
