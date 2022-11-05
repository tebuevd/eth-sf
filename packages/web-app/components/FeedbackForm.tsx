import { VerificationResponse, WorldIDWidget } from "@worldcoin/id";
import React, { useState } from "react";
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
import { useAccount } from "wagmi";

export default function FeedbackForm() {
  const account = useAccount();
  const address = account?.address ?? null;

  const ipfsAdd = trpc.useMutation(["ipfs.add"]);
  const [reviewee, setReviewee] = useState("");
  const [review, setReview] = useState("");
  const [score, setScore] = useState(0);

  const [verificationResponse, setVerificationResponse] =
    useState<VerificationResponse | null>(null);

  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <VStack w={"100%"} spacing="24px">
          <Box w="100%">
            <FormControl className="w-full">
              <FormLabel className="pb-4">Reviewee's Address</FormLabel>
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
            <WorldIDWidget
              appName="ETH Global SF"
              actionId={`review_by_${address}_on_${reviewee}`}
              signal={score.toString()}
              signalDescription={`Submit Review for ${reviewee}`}
              onSuccess={(verificationResponse) => {
                setVerificationResponse(verificationResponse);
              }}
              onError={(error) => console.error(error)}
              enableTelemetry
              debug
            />
          </Box>
          <ButtonGroup>
            <Button
              variant={"solid"}
              colorScheme="blue"
              disabled={!verificationResponse || !reviewee || !score || !review}
              onClick={async () => {
                await ipfsAdd.mutateAsync("Hello World");
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
