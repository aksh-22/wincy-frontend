import React, { useState, useEffect, memo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function DragAndDrop({ data = [], onChange, renderComponent, disabled }) {
  useEffect(() => {
    setCards(data);
  }, [data]);
  const [cards, setCards] = useState([...data]);

  const onDragEndHandler = (result) => {
    if (!result.destination) {
      return;
    }
    const items = cards;
    const reOrderedItems = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reOrderedItems[0]);
    setCards([...items]);
    onChange(items);
  };
  const MemoList = (item, index) =>
    React.useMemo(
      () =>
        React.cloneElement(renderComponent, {
          item: item,
          index: index,
        }),
      [item]
    );
  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="card" direction="vertical">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            provided={provided}
            style={{
              listStyle: "none",
              padding: 0,
            }}
          >
            {cards.map((li, index) => {
              return (
                <Draggable
                  key={li._id}
                  draggableId={li._id}
                  index={index}
                  isDragDisabled={disabled}
                >
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      {MemoList(li, index)}
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default memo(DragAndDrop);
