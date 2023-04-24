import React from 'react';
import List from './List';

const fakeData = [
  { text: 'Item 1' },
  { text: 'Item 2' },
  { text: 'Item 3' },
  { text: 'Item 4' },
  { text: 'Item 5' },
];

const App = () => {
  return (
      <List items={fakeData} />
  );
};

export default App;
