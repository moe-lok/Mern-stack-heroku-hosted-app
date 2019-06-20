const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const todoRoutes = express.Router();
const path = require('path');
const Pusher = require('pusher');
const URI = require('./config/index');

const pusher = new Pusher({
    appId      : '806958',
    key        : '9d54f9c1c639963990ba',
    secret     : '3d9737605a1c1ac0eed6',
    cluster    : 'ap1',
    encrypted  : true,
  });
const channel = 'todos';

let Todo = require('./models/todo.model');

// require db connection
require('./models');
mongoose.connect(process.env.MONGODB_URI || URI, { useNewUrlParser: true });
const db = require('./models/index');

app.use('/', express.static(path.join(__dirname, '/client/build')));

app.use(cors());
app.use(bodyParser.json());

/*
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})*/


todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
}).delete(function(req, res){
    Todo.findById({ _id: req.params.id })
			.then(todo => todo.remove())
			.then(alltodo => res.json(alltodo))
			.catch(err => res.status(422).json(err));
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});


app.use('/todos', todoRoutes);

app.use(express.static('./client/build'));


// If no API routes are hit, send the React app
app.use(function(req, res) {
	res.sendFile(path.join(__dirname, './client/build/index.html'));
});

db.once('open',()=>{
    app.listen(PORT, function() {
        console.log("Server is running on Port: " + PORT);
    
    });

    const todosCollection = db.collection('todos');
    const changeStream = todosCollection.watch();

    changeStream.on('change',(change)=>{
        console.log(change);

        if(change.operationType === 'insert') {
            const todos = change.fullDocument;
            pusher.trigger(
              channel,
              'inserted', 
              {
                id: todos._id,
                todo_description: todos.todo_description,
                todo_responsible: todos.todo_responsible,
                todo_priority: todos.todo_description,
                todo_completed: todos.todo_completed,
              }
            ); 
          } else if(change.operationType === 'delete') {
            pusher.trigger(
              channel,
              'deleted', 
              change.documentKey._id
            );
          } else if(change.operationType === 'update') {
            pusher.trigger(
              channel,
              'updated', 
              change.updateDescription
            );
          }
    });

});