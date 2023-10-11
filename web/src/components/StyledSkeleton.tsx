import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import Skeleton from "react-loading-skeleton";

export const StyledSkeleton = styled(Skeleton)`
  z-index: 0;
`;

const SkeletonDisputeCardContainer = styled.div`
  width: 100%;
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

const StyledSkeletonDisputeCard = styled(Skeleton)`
  height: 260px;
`;

const StyledSkeletonDisputeListItem = styled(Skeleton)`
  height: 62px;
`;

export const SkeletonDisputeCard = () => (
  <SkeletonDisputeCardContainer>
    <StyledSkeletonDisputeCard />
  </SkeletonDisputeCardContainer>
);

export const SkeletonDisputeListItem = () => <StyledSkeletonDisputeListItem />;
