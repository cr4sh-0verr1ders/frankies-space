import React, { Component } from 'react';
import mapBackground from './map.jpg';
import './App.css';
import { User, Avatar } from './User';
import MessageBox from './MessageBox';
import Login from './Login';
import socket from './socket';

const SPEED = 5;

function Map() {
  return (
    <img className="map" src={mapBackground}/>
  );
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      isAuthed: false,
      self: new User(),
      move: {
        up: false,
        left: false,
        down: false,
        right: false,
      },
      others: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    socket.on("connect", () => {
      this.state.self.id = socket.id;
    });

    socket.on("update", userStates => {
      let users = userStates
        .map(user => new User(user))
        .filter(user => user.id !== socket.id);
      this.setState({
        ...this.state,
        others: users,
      });
    });

    socket.on("identified", identity => {
      let self = this.state.self;
      self.name = identity.name;
      self.icon = identity.uri;
      this.setState({
        ...this.state,
        self,
      });
    });

    socket.on("clearmessage", () => {
      let { self } = this.state;
      self.message = "";
      this.setState({
        ...this.state,
        self,
      });
    });
  }

  componentDidMount() {
    requestAnimationFrame((this.tick).bind(this))
  }

  tick() {
    const { self, move } = this.state;
    this.setState({
      self: self.step(
        SPEED * (move.right - move.left),
        SPEED * (move.down - move.up)
      ),
    });
    socket.emit("position", {x: self.x, y: self.y});
    requestAnimationFrame((this.tick).bind(this))
  }

  // componentWillUnmount() {
  //   clearInterval(this.tickerID);
  // }

  setMove(newMove) {
    this.setState({
      ...this.state,
      move: {
        ...this.state.move,
        ...newMove,
      },
    });
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if(key === 'w') this.setMove({ up: true });
    if(key === 'a') this.setMove({ left: true });
    if(key === 's') this.setMove({ down: true });
    if(key === 'd') this.setMove({ right: true });
  }

  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if(key === 'w') this.setMove({ up: false });
    if(key === 'a') this.setMove({ left: false });
    if(key === 's') this.setMove({ down: false });
    if(key === 'd') this.setMove({ right: false });
  }

  handleIsAuthed(isAuthed) {
    this.setState({
      ...this.state,
      isAuthed,
    });
  }

  handleMessage(msg) {
    this.setState({
      ...this.state,
      self: this.state.self.setMessage(msg),
    });
  }

  render() {
    const { self, others } = this.state;
    const cssPosition = {
      "--origin-x": self.x,
      "--origin-y": self.y,
    };

    let otherAvatars = others.map(user => {
      return <Avatar key={user.id} user={user} />;
    });

    return (
      <div
        className="App"
        tabIndex="0" // Necessary to accept input
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        style={cssPosition}
      >
        <Map />
        {otherAvatars}
        {this.state.isAuthed && <Avatar user={self} />}
        {this.state.isAuthed && <MessageBox onMessage={this.handleMessage.bind(this)} />}
        {!this.state.isAuthed && <Login setIsAuthed={this.handleIsAuthed.bind(this)} />}
      </div>
    );
  }
}

export default App;
