import React from 'react';
import styled from '@emotion/styled';

import {addErrorMessage} from 'app/actionCreators/indicator';
import {PanelTable} from 'app/components/panels';
import {t} from 'app/locale';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import {DynamicSamplingRule, DynamicSamplingRuleType} from 'app/types/dynamicSampling';

import DraggableList, {UpdateItemsProps} from './draggableList';
import Rule from './rule';
import {layout} from './utils';

type Props = {
  rules: Array<DynamicSamplingRule>;
  disabled: boolean;
  onEditRule: (rule: DynamicSamplingRule) => () => void;
  onDeleteRule: (rule: DynamicSamplingRule) => () => void;
  onUpdateRules: (rules: Array<DynamicSamplingRule>) => void;
};

type RulesWithId = Array<DynamicSamplingRule & {id: string}>;

type State = {
  rules: RulesWithId;
  isAnyMenuActionsOpen: boolean;
};

class Rules extends React.PureComponent<Props, State> {
  state: State = {
    rules: [],
    isAnyMenuActionsOpen: false,
  };

  componentDidMount() {
    this.getRules();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.rules !== this.props.rules) {
      this.getRules();
    }
  }

  handleUpdateRulesParent() {
    const {onUpdateRules} = this.props;
    const {rules} = this.state;

    const reordered = rules.map(({id: _id, ...rule}) => rule);
    onUpdateRules(reordered);
  }

  handleUpdateRules = ({
    activeIndex,
    overIndex,
    reorderedItems: ruleIds,
  }: UpdateItemsProps) => {
    const {rules} = this.state;
    const reorderedRules = ruleIds
      .map(ruleId => rules.find(rule => rule.id === ruleId))
      .filter(rule => !!rule) as RulesWithId;

    if (
      rules[activeIndex].type === DynamicSamplingRuleType.TRACE &&
      rules[overIndex].type === DynamicSamplingRuleType.TRANSACTION
    ) {
      addErrorMessage(
        t('Transaction traces rules cannot be under Individual transactions rules')
      );
      return;
    }

    if (
      rules[activeIndex].type === DynamicSamplingRuleType.TRANSACTION &&
      rules[overIndex].type === DynamicSamplingRuleType.TRACE
    ) {
      addErrorMessage(
        t('Individual transactionsrules cannot be above Transaction traces rules')
      );
      return;
    }

    this.setState({rules: reorderedRules}, this.handleUpdateRulesParent);
  };

  handleChangeMenuActions = (isOpen: boolean) => {
    this.setState({isAnyMenuActionsOpen: isOpen});
  };

  getRules() {
    const {rules} = this.props;
    const rulesWithId = rules.map((rule, index) => ({...rule, id: String(index)}));
    this.setState({rules: rulesWithId});
  }

  render() {
    const {onEditRule, onDeleteRule, disabled} = this.props;
    const {rules, isAnyMenuActionsOpen} = this.state;

    return (
      <StyledPanelTable
        headers={['', t('Type'), t('Category'), t('Sampling Rate'), '']}
        isEmpty={!rules.length}
        emptyMessage={t('There are no rules to display')}
      >
        <StyledDraggableList
          disabled={disabled || isAnyMenuActionsOpen}
          isAnyMenuActionsOpen={isAnyMenuActionsOpen}
          items={rules.map(rule => rule.id)}
          onUpdateItems={this.handleUpdateRules}
          renderItem={({value, listeners, attributes, style: grabStyle}) => {
            const currentRule = rules.find(rule => rule.id === value);

            if (!currentRule) {
              return null;
            }

            const {id: _id, ...rule} = currentRule;

            return (
              <Rule
                rule={rule}
                onEditRule={onEditRule(rule)}
                onDeleteRule={onDeleteRule(rule)}
                disabled={disabled}
                grabStyle={grabStyle}
                listeners={listeners}
                grabAttributes={attributes}
                onChangeMenuActions={this.handleChangeMenuActions}
              />
            );
          }}
        />
      </StyledPanelTable>
    );
  }
}

export default Rules;

const StyledPanelTable = styled(PanelTable)`
  overflow: visible;
  margin-bottom: 0;
  border: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  ${p => layout(p.theme)}
  > * {
    ${overflowEllipsis};
    :not(:last-child) {
      border-bottom: 1px solid ${p => p.theme.border};
    }
    :nth-child(n + 6) {
      ${p =>
        !p.isEmpty
          ? `
              display: grid;
              grid-column: 1/-1;
              padding: 0;
            `
          : `
              display: block;
              grid-column: 1/-1;
            `}
    }
  }
`;

const StyledDraggableList = styled(DraggableList)<{
  isAnyMenuActionsOpen: boolean;
}>`
  ${p =>
    p.isAnyMenuActionsOpen &&
    `
      transform: none;
      transform-origin: 0;
      overflow: visible;
    `}
`;
