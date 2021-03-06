import React, { Component } from 'react';
import mapBackground from './map.jpg';
import './App.css';
import { User, Avatar } from './User';
import MessageBox from './MessageBox';
import Login from './Login';
import socket from './socket';

const SPEED = 0.5;
const SPRINT = 0.8;

function Map() {
  return (
    <img className="map" src={mapBackground}/>
  );
}

function Geofence(props) {
  let inFence = props.location ? 1 : 0;
  let style = {
    opacity: inFence,
    transform: `scale(${inFence})`,
  };
  let message = "";
  if(props.location) {
    message = props.location;
  }
  return (
    <div className="Geofence acrylic" style={style}>
      {message}
    </div>
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
        sprint: false,
      },
      others: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.onkeydown = this.handleKeyDown
    window.onkeyup = this.handleKeyUp

    socket.on("connect", () => {
      this.state.self.id = socket.id;
      console.log("Connected to server, socket id", socket.id);
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
    setInterval(() => {
      socket.emit("position", {x: this.state.self.x, y: this.state.self.y});
    }, 100);
  }

  tick(timestamp) {
    if(this.timestamp === undefined) {
      this.timestamp = timestamp;
      requestAnimationFrame((this.tick).bind(this))
      return;
    }

    let delta = timestamp - this.timestamp;
    this.timestamp = timestamp;

    const { self, move } = this.state;
    let speed = move.sprint ? SPRINT : SPEED;
    this.setState({
      self: self.step(
        delta * speed * (move.right - move.left),
        delta * speed * (move.down - move.up)
      ),
    });

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
    if(key === 'shift') this.setMove({ sprint: true });
  }

  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if(key === 'w') this.setMove({ up: false });
    if(key === 'a') this.setMove({ left: false });
    if(key === 's') this.setMove({ down: false });
    if(key === 'd') this.setMove({ right: false });
    if(key === 'shift') this.setMove({ sprint: false });
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
      "--origin-x": self.x + "px",
      "--origin-y": self.y + "px",
    };

    let otherAvatars = others.map(user => {
      return <Avatar key={user.id} user={user} />;
    });

    let content = this.state.isAuthed ? <>
      <Avatar user={self} />
      <MessageBox onMessage={this.handleMessage.bind(this)} />
      <Geofence location={this.state.self.location} />
    </> : <>
      <Login setIsAuthed={this.handleIsAuthed.bind(this)} />
    </>

    return (
      <div
        className="App"
        tabIndex="0" // Necessary to accept input
        // onKeyDown={this.handleKeyDown}
        // onKeyUp={this.handleKeyUp}
        style={cssPosition}
      >
        <Map />
        {otherAvatars}
        {content}
      </div>
    );
  }
}

export default App;
