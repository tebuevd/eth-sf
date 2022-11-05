import { WorldIDWidget } from "@worldcoin/id";
import React from "react";
import {
  FormControl,
  FormLabel,
  Box,
  Flex,
  Input,
  VStack,
  Select,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function FeedbackForm({
  signal,
  action,
}: {
  signal: string;
  action: string;
}) {
  const ipfsAdd = trpc.useMutation(["ipfs.add"]);
  const [values, setValues] = useState<{
    tokenAddress: string;
    review: string;
    score: number;
  }>({
    tokenAddress: "",
    review: "",
    score: 0,
  });

  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <VStack w={"100%"} spacing="24px">
          <Box w="100%">
            <FormControl className="w-full">
              <FormLabel className="pb-4">Token Address</FormLabel>
              <Input
                onChange={(e) => {
                  setValues({ ...values, tokenAddress: e.target.value });
                }}
                value={values.tokenAddress}
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
                onChange={(event) =>
                  setValues({
                    ...values,
                    score: parseFloat(event.target.value),
                  })
                }
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
                  setValues({ ...values, review: e.target.value });
                }}
                height={150}
                value={values.review}
                className="w-full"
              />
            </FormControl>
          </Box>
          <Box>
            <WorldIDWidget
              actionId={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION_ID ?? ""}
              signal="my_signal"
              enableTelemetry
              onSuccess={(verificationResponse) =>
                console.log(verificationResponse)
              } // you'll actually want to pass the proof to the API or your smart contract
              onError={(error) => console.error(error)}
            />
          </Box>
          <button
            onClick={async function () {
              const res = await ipfsAdd.mutateAsync("Hello World");

              console.log({ res });
            }}
          >
            Test IPFS
          </button>
        </VStack>
      </Flex>
    </>
  );
}
