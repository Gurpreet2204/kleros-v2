import React from "react";
import styled from "styled-components";
import Search from "./Search";
import StatsAndFilters from "./StatsAndFilters";
import CasesGrid, { ICasesGrid } from "./CasesGrid";
import useTracking from "../../hooks/useTracking";

const StyledHR = styled.hr`
  margin-top: 24px;
  margin-bottom: 24px;
`;

interface ICasesDisplay extends ICasesGrid {
  title?: string;
  className?: string;
}

const CasesDisplay: React.FC<ICasesDisplay> = ({
  disputes,
  currentPage,
  setCurrentPage,
  numberDisputes,
  casesPerPage,
  title = "Cases",
  className,
}) => {
  useTracking("CasesDisplay", {
    disputes,
    currentPage,
    setCurrentPage,
    numberDisputes,
    casesPerPage,
    title,
    className,
  });
  return (
    <div {...{ className }}>
      <h1>{title}</h1>
      <Search />
      <StatsAndFilters />
      <StyledHR />
      {disputes.length > 0 ? (
        <CasesGrid
          {...{
            disputes,
            currentPage,
            setCurrentPage,
            numberDisputes,
            casesPerPage,
          }}
        />
      ) : (
        <h1>wow no cases</h1>
      )}
    </div>
  );
};

export default CasesDisplay;
