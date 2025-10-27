import React, { useEffect } from 'react';
import { getPolicy } from '../../services/contract';
import './FundingProgressSoFar.css';
import DetailItem from '../Section/DetailItem';

const DetailsVisibility = {
  OVERVIEW: 'FundingProgressTotal--Overview',
  FULL: 'FundingProgressTotal--Full',
};

export default function DaoConfig({ title, policyArrayData }) {
  return (
    <div className={`FundingProvidedsoFar ${DetailsVisibility.OVERVIEW}`}>
      <div className="ui card">
        <div className="content FundingHeaders">
          <div className="ui header content Funding__Header">{title}</div>
        </div>
        <div className="content GrantList__Content">
          <div className="ui sub header GrantList__Sub">
            this DAO's config list
          </div>
          <div className="ItemList">
            {policyArrayData.map(({ name, value }) => (
              <DetailItem name={name} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
