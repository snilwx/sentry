import React from 'react';
import {DraggableSyntheticListeners, UseDraggableArguments} from '@dnd-kit/core';
import styled from '@emotion/styled';

import {IconGrabbable} from 'app/icons/iconGrabbable';
import space from 'app/styles/space';
import {DynamicSamplingRule} from 'app/types/dynamicSampling';

import {layout} from '../utils';

import Actions from './actions';
import Conditions from './conditions';
import SampleRate from './sampleRate';
import Type from './type';

type Props = {
  rule: DynamicSamplingRule;
  onEditRule: () => void;
  onDeleteRule: () => void;
  onChangeMenuActions: (isOpen: boolean) => void;
  disabled: boolean;
  listeners: DraggableSyntheticListeners;
  grabAttributes?: UseDraggableArguments['attributes'];
  grabStyle?: React.CSSProperties;
};

type State = {
  isMenuActionsOpen: boolean;
};

class Rule extends React.Component<Props, State> {
  state: State = {
    isMenuActionsOpen: false,
  };

  handleChangeMenuAction = () => {
    const {onChangeMenuActions} = this.props;

    const isMenuActionsOpen = !this.state.isMenuActionsOpen;

    this.setState(
      {
        isMenuActionsOpen,
      },
      () => onChangeMenuActions(isMenuActionsOpen)
    );
  };

  render() {
    const {
      rule,
      onEditRule,
      onDeleteRule,
      disabled,
      listeners,
      grabAttributes,
      grabStyle,
    } = this.props;

    const {type, condition, sampleRate} = rule;
    const {isMenuActionsOpen} = this.state;

    return (
      <Columns>
        <Column>
          <IconGrabbableWrapper
            {...listeners}
            disabled={disabled}
            style={grabStyle}
            {...grabAttributes}
          >
            <IconGrabbable />
          </IconGrabbableWrapper>
        </Column>
        <Column>
          <Type type={type} />
        </Column>
        <Column>
          <Conditions condition={condition} />
        </Column>
        <CenteredColumn>
          <SampleRate sampleRate={sampleRate} />
        </CenteredColumn>
        <Column>
          <Actions
            onEditRule={onEditRule}
            onDeleteRule={onDeleteRule}
            disabled={disabled}
            onOpenMenuActions={this.handleChangeMenuAction}
            isMenuActionsOpen={isMenuActionsOpen}
          />
        </Column>
      </Columns>
    );
  }
}

export default Rule;

const Columns = styled('div')`
  cursor: default;
  display: grid;
  align-items: center;
  ${p => layout(p.theme)}
  border-bottom: 0;
  > * :nth-child(5n) {
    overflow: visible;
    justify-content: flex-end;
  }
`;

const Column = styled('div')`
  display: flex;
  align-items: center;
  padding: ${space(2)};
`;

const CenteredColumn = styled(Column)`
  text-align: center;
  justify-content: center;
`;

const IconGrabbableWrapper = styled('div')<{disabled: boolean}>`
  ${p => p.disabled && `color: ${p.theme.disabled}`};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'grab')};
  outline: none;
`;
