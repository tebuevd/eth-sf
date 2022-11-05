import {
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Flex,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";

import { TokenDistribution, tokenDistribution } from "../utils/helpers";
import { useCreateAirdrop } from "../hooks/useCreateAirdrop";
import { useAccount } from "wagmi";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const AirdropForm = () => {
  const [jsonError, setJsonError] = useState<undefined | string>(undefined);
  const { isConnected } = useAccount();

  const [values, setValues] = useState<{
    tokenAddress: string;
    tokenDistribution: undefined | TokenDistribution;
    startTime: undefined | Date;
    endTime: undefined | Date;
  }>({
    tokenAddress: "",
    tokenDistribution: undefined,
    startTime: undefined,
    endTime: undefined,
  });
  const { sendCreateTx, createdAirdropUUID, processing } = useCreateAirdrop();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      const reader = new FileReader();

      reader.readAsText(file);
      reader.onload = function (e) {
        if (!e.target?.result) {
          setJsonError("Upload a valid JSON");
          return;
        }

        const res = tokenDistribution.safeParse(
          JSON.parse(e.target.result as string)
        );

        if (res.success) {
          setJsonError(undefined);
          setValues({ ...values, tokenDistribution: res.data });
        } else {
          setJsonError("Upload a valid JSON");
        }
      };
    },
    [values]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { "text/html": [".json"] },
  });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
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
            <FormLabel className="pb-4">JSON file</FormLabel>
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <div>
                {!values.tokenDistribution
                  ? "Drag and drop your JSON or click to upload. \n Schema: { decimals: number,  dropInfo: { publicAddress: string, tokens: number }[] }"
                  : "Json Uploaded"}
              </div>
            </div>
            {jsonError && (
              <FormHelperText className="text-red-600">
                {jsonError}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box w="100%" className="flex justify-between">
          <FormControl className="w-full">
            <FormLabel className="pb-4">Airdrop Start Time</FormLabel>
            <DatePicker
              className="w-5/6"
              disabled={!isConnected}
              selected={values.startTime}
              onChange={(date) => {
                setValues({ ...values, startTime: date ?? undefined });
              }}
            />
          </FormControl>
          <FormControl className="w-full">
            <FormLabel className="pb-4">Airdrop End Time</FormLabel>
            <DatePicker
              className="w-5/6"
              selected={values.endTime}
              onChange={(date) => {
                setValues({ ...values, endTime: date ?? undefined });
              }}
            />
          </FormControl>
        </Box>

        {!createdAirdropUUID ? (
          <Button
            onClick={async () => {
              if (
                values.endTime &&
                values.startTime &&
                values.tokenAddress &&
                values.tokenDistribution
              ) {
                await sendCreateTx({
                  endDate: values.endTime,
                  startDate: values.startTime,
                  tokenAddress: values.tokenAddress,
                  tokenDistribution: values.tokenDistribution,
                });
              }
            }}
            className="w-full bg-green-200 border-solid h-10 font-mono border-2"
            disabled={!!processing || !!createdAirdropUUID}
          >
            {!processing ? "Submit" : "Processing..."}
          </Button>
        ) : (
          <div className="w-full bg-green-50 border-solid h-10 font-mono border-2 text-center">
            {`${window.location.origin}/claim/${createdAirdropUUID}`}
          </div>
        )}
      </VStack>
    </Flex>
  );
};

export default function CreateAirdropImpl() {
  const { isConnected } = useAccount();

  return isConnected ? (
    <AirdropForm />
  ) : (
    <div className="h-full flex flex-col justify-center items-center text-4xl pb-10">
      Connect wallet to create an airdrop
    </div>
  );
}
