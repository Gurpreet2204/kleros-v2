import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { IDisputeTemplate, useNewDisputeContext } from "context/NewDisputeContext";
import { wrapWithToast } from "utils/wrapWithToast";
import {
  useDisputeResolverCreateDisputeForTemplate,
  usePrepareDisputeResolverCreateDisputeForTemplate,
} from "hooks/contracts/generated";
import { prepareArbitratorExtradata } from "utils/prepareArbitratorExtradata";
import { usePublicClient } from "wagmi";
import Popup, { PopupType } from "components/Popup";
import DisputeIcon from "assets/svgs/icons/dispute.svg";

const StyledButton = styled(Button)``;

const SubmitDisputeButton: React.FC = () => {
  const publicClient = usePublicClient();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [disputeId, setDisputeID] = useState<number>();

  const { disputeTemplate, disputeData, resetDisputeData, isSubmittingCase, setIsSubmittingCase } =
    useNewDisputeContext();

  const { config: submitCaseConfig } = usePrepareDisputeResolverCreateDisputeForTemplate({
    enabled: isTemplateValid(disputeTemplate),
    args: [
      prepareArbitratorExtradata(disputeData.courtId, disputeData.numberOfJurors, 1), //TODO: decide which dispute kit to use
      JSON.stringify(disputeTemplate),
      "TODO: mappings",
      BigInt(disputeData.numberOfRulingOptions),
    ],
    value: BigInt(disputeData.arbitrationCost ?? 0),
  });

  const { writeAsync: submitCase } = useDisputeResolverCreateDisputeForTemplate(submitCaseConfig);

  const isButtonDisabled = useMemo(
    () => isSubmittingCase || !isTemplateValid(disputeTemplate),
    [isSubmittingCase, disputeTemplate]
  );

  return (
    <>
      {" "}
      <StyledButton
        text="Submit the case"
        disabled={isButtonDisabled}
        onClick={() => {
          if (submitCase) {
            setIsSubmittingCase(true);
            wrapWithToast(async () => await submitCase().then((response) => response.hash), publicClient)
              .then((res) => {
                if (res.status === "success") {
                  //TODO: better way or maybe log decoding to get the disputeID
                  const id = parseInt(res.logs[0].topics[1], 16);
                  setDisputeID(id);
                  setIsPopupOpen(true);
                }

                resetDisputeData();
              })
              .finally(() => {
                setIsSubmittingCase(false);
              });
          }
        }}
      />
      {isPopupOpen && disputeId && (
        <Popup
          title={`Case #${disputeId} submitted`}
          icon={DisputeIcon}
          popupType={PopupType.DISPUTE_CREATED}
          setIsOpen={setIsPopupOpen}
          disputeId={disputeId}
        />
      )}
    </>
  );
};

const isTemplateValid = (disputeTemplate: IDisputeTemplate) => {
  const areVotingOptionsFilled =
    disputeTemplate.question !== "" && disputeTemplate.answers.every((answer) => answer.title !== "");

  return (disputeTemplate.title &&
    disputeTemplate.description &&
    disputeTemplate.policyURI &&
    areVotingOptionsFilled) as boolean;
};

export default SubmitDisputeButton;
