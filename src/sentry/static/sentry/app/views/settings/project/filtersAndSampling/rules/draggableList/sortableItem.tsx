import React from 'react';
import {useSortable} from '@dnd-kit/sortable';

import Item from './item';

export type SortableItemProps = Pick<
  React.ComponentProps<typeof Item>,
  'renderItem' | 'index' | 'wrapperStyle' | 'innerWrapperStyle' | 'className'
> & {
  id: string;
  disabled?: boolean;
};

function SortableItem({
  id,
  index,
  renderItem,
  wrapperStyle,
  innerWrapperStyle,
  disabled,
  className,
}: SortableItemProps) {
  const {
    attributes,
    isSorting,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id, disabled});

  return (
    <Item
      forwardRef={setNodeRef}
      value={id}
      sorting={isSorting}
      renderItem={renderItem}
      index={index}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle}
      innerWrapperStyle={innerWrapperStyle}
      listeners={listeners}
      attributes={attributes}
      className={className}
      disabled={disabled}
    />
  );
}

export default SortableItem;
