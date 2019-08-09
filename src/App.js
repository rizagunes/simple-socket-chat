import React, { Component } from 'react';

import './App.css';
import ChannelSection from './components/channels/ChannelSection.jsx';
import UserSection from './components/users/UserSection.jsx';
import MessageSection from './components/messages/MessageSection.jsx';
import Socket from './socket';

class App extends Component {
  constructor(props) {
    super(props);

    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onAddChannel = this.onAddChannel.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.onEditUser = this.onEditUser.bind(this);
    this.onRemoveUser = this.onRemoveUser.bind(this);
    this.onAddMessage = this.onAddMessage.bind(this);

    this.addChannel = this.addChannel.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.setChannel = this.setChannel.bind(this);
    this.setUserName = this.setUserName.bind(this);

    this.state = {
      channels: [],
      users: [],
      messages: [],
      activeChannel: {},
      connected: false,
    };
  }

  componentDidMount() {
    let socket = this.socket = new Socket();
    socket.on('connect', this.onConnect);
    socket.on('disconnect', this.onDisconnect);
    socket.on('add_channel', this.onAddChannel);
    socket.on('add_user', this.onAddUser);
    socket.on('edit_user', this.onEditUser);
    socket.on('remove_user', this.onRemoveUser);
    socket.on('add_message', this.onAddMessage);
  }

  onConnect() {
    this.setState({ connected: true });
    this.socket.emit('channel subscribe');
    this.socket.emit('user subscribe');
  }

  onDisconnect() {
    this.setState({ connected: false });
  }

  onAddChannel(channel) {
    let { channels } = this.state;
    channels.push(channel);
    this.setState({ channels });
  }

  onAddUser(user) {
    let { users } = this.state;
    users.push(user);
    this.setState({ users });
  }

  onEditUser(editUser) {
    let { users } = this.state;
    users = users.map(user => {
      if (editUser.id === user.id) {
        return editUser;
      }
      return user;
    });
    this.setState({ users });
  }

  onRemoveUser(removeUser) {
    let { users } = this.state;
    users = users.filter(user => {
      return (removeUser.id !== user.id);
    });
    this.setState({ users });
  }

  onAddMessage(message) {
    let { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
  }


  addChannel(name) {
    this.socket.emit('add_channel', { name });
  }

  addMessage(body) {
    let { activeChannel } = this.state;
    this.socket.emit('add_message', { channelId: activeChannel.id, body });
  }

  setChannel(activeChannel) {
    this.setState({ activeChannel });
    this.socket.emit('message unsubscribe');
    this.setState({ messages: [] });
    this.socket.emit('message subscribe', { channelId: activeChannel.id });
  }

  setUserName(name) {
    this.socket.emit('edit_user', { name });
  }

  render() {
    return (
      <div className='app'>
        <div className='nav bg-info'>
          <ChannelSection {...this.state} addChannel={this.addChannel}
                          setChannel={this.setChannel}/>
          <UserSection {...this.state} setUserName={this.setUserName}/>
        </div>
        <MessageSection {...this.state} addMessage={this.addMessage}/>
      </div>

    );
  }
}

export default App;
