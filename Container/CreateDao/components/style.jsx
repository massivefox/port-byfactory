import {
  Accordion,
  Button,
  Card,
  Placeholder,
  Segment,
  Table,
} from 'semantic-ui-react';
import styled from 'styled-components';
import logo from 'images/sss-logo.png';

export const Description = styled.div`
  color: #7a7c85;
  font-size: 16px;
  margin: 10px auto 30px;
  padding: 16px;
  border-radius: 8px;
`;

export const ErrorMessage = styled.p`
  margin-top: 4px;
  color: rgb(224, 180, 180) !important;
`;

export const ActivityContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 12px;
  label {
    font-weight: 500;
  }
`;

export const FormFieldWrapper = styled.div`
  margin-bottom: 40px;
`;

export const TemplateDesc = styled.div`
  min-height: 100px;
`;

export const DaoDescWrapper = styled.div`
  padding: 20px;

  .ui.header {
    color: #a7a8ab !important;
  }
  p {
    margin-bottom: 4px;
    color: #a7a8ab !important;
  }
  p:last-child {
    margin: 0;
  }
`;

export const ByAccordion = styled(Accordion)`
  background: var(--biyard-dark) !important;
  .dropdown.icon {
    background: var(--biyard-dark) !important;
  }
  i.icon {
    text-decoration: none !important;
  }
  .title {
    font-size: 16px !important;
  }
`;

export const ProposalTypeWrapper = styled.div`
  margin: 0 20px;
`;

export const BySegment = styled(Segment)`
  background-color: var(--biyard-dark-light) !important;
`;

export const TodoContent = styled.div`
  text-align: center;
  height: 100px;
  background-position: center;
  background-size: contain;
  background-image: url(${logo}) !important;
  opacity: 0.3;

  // .image {
  //   display: inline-block !important;
  //   opacity: 0.3;
  //   margin-bottom: 1em;
  // }
`;

export const CheckboxLabel = styled.label`
  color: ${props => props.disabled && 'grey'};
`;

export const SubDescription = styled.div`
  font-size: 14px;
  margin: 10px 10px 30px;
  padding: 16px;
  background-color: var(--gray);
  border-radius: 8px;
`;

export const ProposalTypeLabel = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  .label {
    border: 1px solid #c0c0c0;
    border-radius: 12px !important;
    background-color: #ffffff !important;
    box-shadow: rgba(0, 0, 0, 0.6) 0px 1px 3px, rgba(0, 0, 0, 0.8) 0px 1px 2px;
    padding: 16px 14px !important;

    > .detail {
      background-color: #ffffff !important;
      margin-left: 0 !important;

      padding: 0 5px 0 0 !important;
    }

    > .icon {
      color: var(--biyard-button) !important;
    }
  }
`;

export const TransitionTable = styled(Table)`
  tr.visible.transition {
    display: table-row !important;
  }
`;

export const ByPlaceHolder = styled(Placeholder)`
  background-color: grey !important;

  .image.header:after,
  .line,
  .line:after,
  > :before {
    background: var(--biyard-bg) !important;
  }

  background-image: linear-gradient(
    to right,
    rgba(0, 20, 40, 0.08) 0,
    rgba(0, 20, 40, 0.15) 15%,
    rgba(0, 20, 40, 0.08) 30%
  ) !important;
`;

export const ActivityCards = styled(Card.Group)`
  max-height: 450px;
  overflow-y: auto;
  .card {
    background-color: rgba(0, 0, 0, 0.1) !important;
    box-shadow: none !important;
    border: 1px solid var(--biyard) !important;
    margin: 0.3em 0.5em !important;

    > :first-child {
      padding-bottom: 5px !important;
    }

    .header {
      color: #ffffff !important;
    }

    .meta {
      color: rgba(255, 255, 255, 0.4) !important;
      margin-top: 5px;
    }

    &:hover {
      background-color: var(--biyard-bg) !important;
    }
    .content p {
      color: #ffffff !important;
    }

    .description {
      color: white !important;
      opacity: 0.7;
    }

    .mini.image {
      width: 30px !important;
      height: 30px;
      object-fit: cover;
      border-radius: 15px !important;
    }
  }
`;

export const RewardCards = styled(ActivityCards)`
  max-height: none !important;
`;

export const CardsWrapper = styled.div`
  max-height: 450px;
  padding: 14px;
  background: var(--biyard-dark-light);
  .rewards {
    max-height: 600px;
  }
`;

export const RewardCardsWrapper = styled.div`
  padding: 14px;
  background: var(--biyard-dark-light);
  .rewards {
    max-height: 600px;
  }
`;

export const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const SbtContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;

  .sbt-button {
    margin: 10px 0 !important;
    background-color: #ffffff !important;
    border: 1px solid #696969 !important;
    border-radius: 8px !important;
  }
`;

export const EmptyRewardMessage = styled.div`
  color: var(--biyard-text);
  padding: 20px;
  text-align: center;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
`;

export const ActivationWrapper = styled.div`
  padding: 14px;

  .header {
    text-align: center;
  }

  .reward-activation {
    display: flex;
    justify-content: space-between;
  }

  .reward-revert {
    margin-top: 34px;
    display: flex;
    justify-content: space-between;
  }

  .reward-sub-activation {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    align-items: center;
  }

  .reward-cond {
    border: 1px solid white;
    padding: 14px;
    margin: 14px 0px;
    border-radius: 8px;

    > :last-child {
      margin-bottom: 0;
    }

    .header {
      text-align: left;
    }

    .dividing.header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    }
    .reward-count {
      .input {
        max-width: 100px;
        margin: 0px 4px;
        height: 30px;
      }
    }
  }
`;

export const RewardCount = styled.div`
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: end;

  > :first-child {
    flex: 1 !important;
  }
`;

export const StepContentsWrapper = styled.div`
  margin: 40px 100px 44px 16px;
  > .header {
    margin-bottom: 40px !important;
  }
`;

export const ToggleOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InputButton = styled(Button)`
  height: 36px;
  background: none !important;
  position: relative;
  right: 40px;
  &:hover {
    box-shadow: none !important;
  }
`;

export const StepRangeContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 2em;

  .field {
    flex: 1 0 60%;
    margin-bottom: 0 !important;
  }

  .value-wrapper {
    flex: 1 0 30%;
  }

  .value-text {
    display: inline-block;
    font-size: 16px;
    background: #f6f6f9;
    border-radius: 8px;
    padding: 6px 8px;

    .range {
      font-weight: 700;
      font-size: 18px;
      color: var(--biyard-button);
    }
  }

  input {
    padding: 0 !important;
    border: none !important;
  }
`;

export const StepContentSearchTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 40px;
  .header {
    margin-bottom: 0 !important;
  }
`;

export const StepContentTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 40px;

  .header {
    margin-bottom: 0 !important;
  }

  .description {
    font-weight: 700;
    font-size: 1em;

    color: #b3b3b3;
  }

  .close-icon {
    flex: 1 0 auto;
  }

  .icon {
    float: right;
  }
`;

export const FormInput = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  gap: 18px;
  flex-wrap: wrap;

  .field {
    flex: 1 0 150px;
  }
`;

export const AddButton = styled(Button)`
  background: #535455 !important;

  height: 38px;
  border-radius: 8px !important;
  color: #ffffff !important;

  &:hover {
  }
`;
