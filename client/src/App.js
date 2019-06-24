import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";

import logo from "./fortraLogo.png";

class App extends Component {

  componentDidMount() {
    this.grantNotificationPermission();
  }

  grantNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('You are already subscribed to message notifications');
      return;
    }

    if (
      Notification.permission !== 'denied' ||
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().then(result => {
        if (result === 'granted') {
          new Notification(
            'Awesome! You will start receiving notifications shortly'
          );
        }
      });
    }
  };

  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="https://muhd-lokman.weebly.com/" target="_blank">
              <img src={logo} width="30" height="30" alt="CodingTheSmartWay.com" />
            </a>
            <Link to="/" className="navbar-brand">MERN-Stack Todo App</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Todos</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Todo</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={TodosList} />
          <Route path="/edit/:id" component={EditTodo} />
          <Route path="/create" component={CreateTodo} />
        </div>
      </Router>
    );
  }
}

export default App;
