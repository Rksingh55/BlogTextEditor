import React from 'react';
import { EditorCode } from './Editor';
import BlogsList from './screens/blog-list';
import { ToastContainer } from 'react-toastify';
import './style.css';
import BasicTabs from './components/tabs';

const tabProps = [
  {
    id: 0,
    title: 'Latest Blog',
    content: <BlogsList />,
  },
  {
    id: 1,
    title: 'Create Blog',
    content: <EditorCode />,
  },
];

function App() {
  return (
    <div className="App">
      <BasicTabs tabProps={tabProps} />
      <ToastContainer />
    </div>
  );
}

export default App;
