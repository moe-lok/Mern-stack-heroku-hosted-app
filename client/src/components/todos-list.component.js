import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pusher from 'pusher-js';
import logo from "../fortraLogo.png";

const PUSHER_APP_KEY = '9d54f9c1c639963990ba';
const PUSHER_APP_CLUSTER = 'ap1';

const Todo = props => {
    function deleteBook(id) {

        axios.delete('/todos/' + id)
            .catch(err => console.log(err));
    };

    return(
    <tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
        </td>
        <td>
            <button onClick={() => deleteBook(props.todo._id)} className="btn btn-primary">Delete</button>
        </td>
    </tr>);
}

export default class TodoList extends Component{

    constructor(props) {
        super(props);
        this.state = {todos: []};
    }



    componentDidMount() {
        this.loadTodos();
        this.pusher = new Pusher(PUSHER_APP_KEY,{
            cluster: PUSHER_APP_CLUSTER,
            encrypted: true,
        });
        this.channel = this.pusher.subscribe('todos');
        this.channel.bind('inserted', this.loadTodos);
        this.channel.bind('deleted', this.loadTodos);
        this.channel.bind('updated', this.loadTodos);

        this.grantNotificationPermission();
    }

    loadTodos = (data)=>{
        new Notification('Todos', { body: data, icon: logo  });
        console.log(data);
        axios.get('/todos/')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error){
                console.log(error);
            });
    }

    todoList() {
        return this.state.todos.map(function(currentTodo, i){
            return <Todo todo={currentTodo} key={i} />;
        })
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
        return(
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
    
}