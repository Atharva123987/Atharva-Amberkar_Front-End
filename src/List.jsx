import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import './list.css'
const WrappedSingleListItem = ({
  index,
  isSelected,
  onClickHandler,
  text,
}) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? 'green' : 'red'}}
      onClick={() => onClickHandler(index)} // Issue 1 : onClickHandler passed using arrow function
    >
      {text}
    </li>
  );
};

WrappedSingleListItem.propTypes = {
  index: PropTypes.number.isRequired, // Issue 2 : index and isSelected should be isRequired
  isSelected: PropTypes.bool.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const SingleListItem = memo(WrappedSingleListItem);

const WrappedListComponent = memo(({
  items, // items are passed from the App.js component
})=> {
  const [selectedIndex, setSelectedIndex] = useState(null); // Issue 3 : Syntax error - useState returns the state variable and then the setter function

  useEffect(() => {
    setSelectedIndex(null);
  }, [items]);

  const handleClick = useCallback(index => { // Optimization 1 : Using useCallback hook to memoize the handleClick function
    setSelectedIndex(index);
  }, []);

  return (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, index) => (
        <SingleListItem
          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex === index} // Issue 4 : Passing boolean value to isSelected as its type is boolean
          key={index} // Optimization 2 : Passing a key for letting react know which items have changed for optimization
        />
      ))}
    </ul>
  )
});

WrappedListComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ // Issue 5 : Syntax error - Should be arrayOf and shape instead of array and shapeOf
    text: PropTypes.string.isRequired,
  })),
};

WrappedListComponent.defaultProps = {
  items: null,
};

const List = memo(WrappedListComponent);

export default List;
