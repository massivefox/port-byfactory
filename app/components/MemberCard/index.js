import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MemberCardContainer = styled.div`
  align-items: center;
  display: flex;
  width: 33%;
  border-radius: 10px;
  font-size: 1.2rem;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-top: 5px;

  > img {
    border-radius: 15px;
    object-fit: cover;
  }

  .description {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin: 0.5em 0;
    min-width: 128px;

    > span {
      margin-left: 10px;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      letter-spacing: -0.03em;

      color: #7a7c85;
    }
  }
`;

export default function MemberCard({ name, imageSrc }) {
  return (
    <MemberCardContainer>
      <img src={imageSrc} width="24" height="24" alt="" />
      <div className="description">
        <span>{name}</span>
      </div>
    </MemberCardContainer>
  );
}

MemberCard.propTypes = {
  name: PropTypes.string,
  imageSrc: PropTypes.string,
};
