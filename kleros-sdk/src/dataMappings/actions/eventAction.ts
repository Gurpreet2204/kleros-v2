import { parseAbiItem } from "viem";
import { AbiEventMapping } from "~src/dataMappings/utils/dataMappingTypes";
import { createResultObject } from "~src/dataMappings/utils/createResultObject";
import { configureSDK, getPublicClient } from "~src/sdk";

export const eventAction = async (mapping: AbiEventMapping) => {
  configureSDK({ apiKey: process.env.ALCHEMY_API_KEY });
  const publicClient = getPublicClient();

  const { abi: source, address, eventFilter, seek, populate } = mapping;
  const parsedAbi = typeof source === "string" ? parseAbiItem(source) : source;

  const filter = await publicClient.createEventFilter({
    address,
    event: parsedAbi,
    args: eventFilter.args,
    fromBlock: eventFilter.fromBlock,
    toBlock: eventFilter.toBlock,
  });

  const contractEvent = await publicClient.getFilterLogs({ filter: filter as any });
  const eventData = contractEvent[0].args;

  return createResultObject(eventData, seek, populate);
};
