import React, { useMemo } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { formatEther } from "viem";
import { useDisputeDetailsQuery } from "queries/useDisputeDetailsQuery";
import { usePopulatedDisputeData } from "hooks/queries/usePopulatedDisputeData";
import { useCourtPolicy } from "queries/useCourtPolicy";
import DisputeInfo from "components/DisputeCard/DisputeInfo";
import Verdict from "components/Verdict/index";
import { useVotingHistory } from "hooks/queries/useVotingHistory";
import { getLocalRounds } from "utils/getLocalRounds";
import { DisputeContext } from "components/DisputePreview/DisputeContext";
import { Policies } from "components/DisputePreview/Policies";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(16, 32)};
  padding: ${responsiveSize(16, 32)};
`;

const Divider = styled.hr`
  width: 100%;
  display: flex;
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: 0;
`;

interface IOverview {
  arbitrable?: `0x${string}`;
  courtID?: string;
  currentPeriodIndex: number;
}

const Overview: React.FC<IOverview> = ({ arbitrable, courtID, currentPeriodIndex }) => {
  const { id } = useParams();
  const { data: disputeDetails, isError } = usePopulatedDisputeData(id, arbitrable);
  const { data: dispute } = useDisputeDetailsQuery(id);
  const { data: courtPolicy } = useCourtPolicy(courtID);
  const { data: votingHistory } = useVotingHistory(id);
  const localRounds = getLocalRounds(votingHistory?.dispute?.disputeKitDispute);
  const courtName = courtPolicy?.name;
  const court = dispute?.dispute?.court;
  const rewards = useMemo(() => (court ? `≥ ${formatEther(court.feeForJuror)} ETH` : undefined), [court]);
  const category = disputeDetails?.category;

  return (
    <>
      <Container>
        <DisputeContext disputeDetails={disputeDetails} isRpcError={isError} />
        <Divider />

        <Verdict arbitrable={arbitrable} />
        <Divider />

        <DisputeInfo
          isOverview={true}
          overrideIsList={true}
          courtId={court?.id}
          court={courtName}
          round={localRounds?.length}
          {...{ rewards, category }}
        />
      </Container>
      <Policies
        disputePolicyURI={disputeDetails?.policyURI}
        courtId={courtID}
        attachment={disputeDetails?.attachment}
      />
    </>
  );
};

export default Overview;
