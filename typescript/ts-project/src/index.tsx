import * as React from 'react';
import * as ReactDom from 'react-dom';

const App:React.FC=()=> {
    console.log('is App');
    return (
      <div className="App">
        created App
      </div>
    );
  }
ReactDom.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('app')
);