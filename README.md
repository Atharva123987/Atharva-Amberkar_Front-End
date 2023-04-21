# Steeleye Frontend Assignment
## Question 1 : Explain what the simple `List` component does.
This is a React component that represents a list with selectable items. The list is composed of individual items, which are represented by the `SingleListItem` component. The `SingleListItem` component takes in several props: 

- `index`: a number that represents the index of the item in the list
- `isSelected`: a boolean that determines whether the item is currently selected
- `onClickHandler`: a function that gets called when the item is clicked
- `text`: a string that represents the text of the item

The `WrappedSingleListItem` component wraps the `SingleListItem` component and defines its prop types. It also sets the background color of the list item based on whether or not it is selected.

The `WrappedListComponent` component represents the entire list. It takes in a prop called `items`, which is an array of objects that each contain a `text` property. It uses the `useState` hook to keep track of the currently selected item's index, and the `useEffect` hook to reset the selected index when the `items` prop changes. It also defines a `handleClick` function that updates the selected index when an item is clicked.

Finally, the `List` component wraps the `WrappedListComponent` component and defines its prop types. It also memoizes the component so that it only re-renders when its props have changed.

## Question 2 : What problems / warnings are there with code?
There are 5 problems with the code - 

```
onClick={onClickHandler(index)}
```
- The `onClickHandler` should be passed as a function but it was being immediately called whenever the component is rendered. It should be called as an arrow function in the `onClick` function.

```
index: PropTypes.number,
isSelected: PropTypes.bool,
```
- The `index` and `isSelected` props should also be `isRequired` as they are essential in the `WrappedSingleListItem` component.

```
const [setSelectedIndex, selectedIndex] = useState();
```
- The `useState` hook returns the state variable and then the setter function but in the code the array is destructured in the wrong way. 

```
isSelected={selectedIndex}
```
- The `SingleListItem` should be passed `isSelected` as a boolean value as its type is `boolean`. It was being passed a `number`.

```
items: PropTypes.array(PropTypes.shapeOf({
    text: PropTypes.string.isRequired,
  })),
```
- Syntax error - The items proptypes in `WrappedListComponent` should have `arrayOf` instead of `array` and `shape` instead of `shapeOf`.

## Question 3 : Please fix, optimize, and/or modify the component as much as you think is necessary.

The above errors are fixed and 2 optimizations are made to the code - 
- Using `useCallback` hook to memoize the `handleClick` function which can help to prevent unnecessary re-renders of the `SingleListItem` component as it will not re-render when the same button is clicked 2 or more times.
- `Key` prop is passed to the `SingleListItem` component which can help React to optimize the rendering of the list items by identifying which items have changed, been added, or been removed. 

### Here is the complete code - 

```
import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';

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

```

