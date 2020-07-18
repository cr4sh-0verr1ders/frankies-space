import React from 'react';
import logo from './map.jpg';
import './App.css';

function Map(props) {
  const styles = {
    "--x": props.x,
    "--y": props.y,
  };
  return (
    <img className="map" style={styles} src={logo}/>
  );
}

function App() {
  return (
    <div className="App">
      <Map x={0} y={0} />
    </div>
  );
}

export default App;
