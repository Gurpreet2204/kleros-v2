import { parseAbiItem } from "viem";
import { AbiEventMapping } from "../utils/actionTypes";
import { createResultObject } from "../utils/createResultObject";
import { configureSDK, getPublicClient } from "../utils/configureSDK";

export const eventAction = async (mapping: AbiEventMapping) => {
  configureSDK({ apiKey: process.env.ALCHEMY_API_KEY });
  const publicClient = getPublicClient();

  const { abi: source, address, eventFilter, seek, populate } = mapping;
  let parsedAbi = typeof source === "string" ? parseAbiItem(source) : source;

  const filter = await publicClient.createEventFilter({
    address: address,
    event: parsedAbi,
    args: eventFilter.args,
    fromBlock: eventFilter.fromBlock,
    toBlock: eventFilter.toBlock,
  });

  const contractEvent = await publicClient.getFilterLogs({ filter: filter as any });
  const eventData = contractEvent[0].args;

  return createResultObject(eventData, seek, populate);
};
