import React from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import { StyledSkeleton } from "components/StyledSkeleton";
import { Card } from "@kleros/ui-components-library";
import { Periods } from "consts/periods";
import { useIsList } from "context/IsListProvider";
import { DisputeDetailsFragment } from "queries/useCasesQuery";
import { landscapeStyle } from "styles/landscapeStyle";
import { useCourtPolicy } from "queries/useCourtPolicy";
import { useDisputeTemplate } from "queries/useDisputeTemplate";
import { useVotingHistory } from "queries/useVotingHistory";
import DisputeInfo from "./DisputeInfo";
import PeriodBanner from "./PeriodBanner";
import { isUndefined } from "utils/index";
import { populateTemplate } from "@kleros/kleros-sdk/dataMappings/utils/populateTemplate";
import { DisputeDetails } from "@kleros/kleros-sdk/dataMappings/utils/disputeDetailsTypes";
import { INVALID_DISPUTE_DATA_ERROR } from "consts/index";

const StyledCard = styled(Card)`
  width: 100%;
  height: 260px;
  ${landscapeStyle(
    () =>
      css`
        /* Explanation of this formula:
          - The 48px accounts for the total width of gaps: 2 gaps * 24px each.
          - The 0.333 is used to equally distribute width among 3 cards per row.
          - The 294px ensures the card has a minimum width.
        */
        width: max(calc((100% - 48px) * 0.333), 294px);
      `
  )}
`;

const StyledListItem = styled(Card)`
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 64px;
`;

const CardContainer = styled.div`
  height: 215px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h3 {
    margin: 0;
  }
`;
const ListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-right: 8px;

  h3 {
    margin: 0;
  }
`;

const ListTitle = styled.div`
  display: flex;
  height: 100%;
  justify-content: start;
  align-items: center;
  width: calc(30vw + (40 - 30) * ((100vw - 300px) / (1250 - 300)));
`;

export const getPeriodEndTimestamp = (
  lastPeriodChange: string,
  currentPeriodIndex: number,
  timesPerPeriod: string[]
) => {
  const durationCurrentPeriod = parseInt(timesPerPeriod[currentPeriodIndex]);
  return parseInt(lastPeriodChange) + durationCurrentPeriod;
};

const TruncatedTitle = ({ text, maxLength }) => {
  const truncatedText = text.length <= maxLength ? text : text.slice(0, maxLength) + "…";
  return <h3>{truncatedText}</h3>;
};

interface IDisputeCard extends DisputeDetailsFragment {
  overrideIsList?: boolean;
}

const DisputeCard: React.FC<IDisputeCard> = ({ id, arbitrated, period, lastPeriodChange, court, overrideIsList }) => {
  const { isList } = useIsList();
  const currentPeriodIndex = Periods[period];
  const rewards = `≥ ${formatEther(court.feeForJuror)} ETH`;
  const date =
    currentPeriodIndex === 4
      ? lastPeriodChange
      : getPeriodEndTimestamp(lastPeriodChange, currentPeriodIndex, court.timesPerPeriod);
  const { data: disputeTemplate } = useDisputeTemplate(id, arbitrated.id as `0x${string}`);
  let disputeDetails: DisputeDetails | undefined;
  try {
    if (disputeTemplate) {
      disputeDetails = populateTemplate(disputeTemplate.templateData, {});
    }
  } catch (e) {
    console.error(e);
  }
  const title = isUndefined(disputeDetails) ? <StyledSkeleton /> : disputeDetails?.title ?? INVALID_DISPUTE_DATA_ERROR;
  const { data: courtPolicy } = useCourtPolicy(court.id);
  const courtName = courtPolicy?.name;
  const category = disputeTemplate?.category;
  const { data: votingHistory } = useVotingHistory(id);
  const localRounds = votingHistory?.dispute?.disputeKitDispute?.localRounds;
  const navigate = useNavigate();
  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigate(`/cases/${id.toString()}`)}>
          <PeriodBanner id={parseInt(id)} period={currentPeriodIndex} />
          <CardContainer>
            <h3>{title}</h3>
            <DisputeInfo
              courtId={court?.id}
              court={courtName}
              period={currentPeriodIndex}
              round={localRounds?.length}
              {...{ category, rewards, date, overrideIsList }}
            />
          </CardContainer>
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigate(`/cases/${id.toString()}`)}>
          <PeriodBanner isCard={false} id={parseInt(id)} period={currentPeriodIndex} />
          <ListContainer>
            <ListTitle>
              <TruncatedTitle text={disputeDetails?.title ?? INVALID_DISPUTE_DATA_ERROR} maxLength={50} />
            </ListTitle>
            <DisputeInfo
              courtId={court?.id}
              court={courtName}
              period={currentPeriodIndex}
              {...{ category, rewards, date }}
            />
          </ListContainer>
        </StyledListItem>
      )}
    </>
  );
};

export default DisputeCard;
