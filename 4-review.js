/*
[router.param] is a powerful tool that we can use to keep our code from repeating core functionality through routes.
This is a pattern we want to frequently follow:

Identify multiple pieces of code that accomplish the same goal

put it to a single component

let that component do that thing
(and update it when we want the thing it does to change - in a single place)

Let's try applying that knowledge again, to another codebase.
If you look at the workspace, you'll find the same problem of data lookup happening.
based on a URL parameter, multiple times in different places.

Try combining that logic in a singple place using [router.param].
*/
/*************************************************************************************************************************************************/
/*
//before:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const vendingMachine = [
  {
    id: 1,
    name: 'Gum',
    price: 1.25,
  },
  {
    id: 7,
    name: 'Bag of chips',
    price: 3.50,
  },
  {
    id: 23,
    name: 'cumin',
    price: .75,
  }
];

let nextSnackId = 24;

app.use(bodyParser.json());

// Add your code here:



app.get('/snacks/', (req, res, next) => {
  res.send(vendingMachine);
});

app.post('/snacks/', (req, res, next) => {
  const newSnack = req.body;
  if (!newSnack.name || !newSnack.price) {
    res.status(400).send('Snack not found!');
  } else {
    newSnack.id = nextSnackId++;
    vendingMachine.push(newSnack);
    res.send(newSnack);
  }
});

app.get('/snacks/:snackId', (req, res, next) => {
  const snackId = Number(req.params.id);
  const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
  if (snackIndex === -1) {
    res.status(404).send('Snack not found!');
  } else {
    res.send(vendingMachine[snackIndex]);
  }
});

app.put('/snacks/:snackId', (req, res, next) => {
  const snackId = Number(req.params.id);
  const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
  if (snackIndex !== -1) {
    vendingMachine[snackIndex] = req.body;
    res.send(vendingMachine[snackIndex]);
  } else {
    res.status(404).send('Snack not found!');
  }
});

app.delete('/snacks/:snackId', (req, res, next) => {
  const snackId = Number(req.params.id);
  const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
  if (snackIndex === -1) {
    res.status(404).send('Snack not found!');
  } else {
    vendingMachine.splice(snackIndex, 1);
    res.status(204).send();
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/
/*************************************************************************************************************************************************/
/*
// what I wrote; wrong

// Add your code here:
app.param('snackRackId', (req, res, next, id) => {
  const idToFind = Number(id);
  const snackIndex = snackRacks.findIndex(snackRack.id === idToFind);
  if (snackIndex !== -1){
    req.snackRack = snackRacks[snackIndex];
    next();
  }
});


app.get('/snacks/', (req, res, next) => {
  res.send(snackRacks);
});

app.post('/snacks/', (req, res, next) => {
  const newSnack = req.body.snackRack;
  newSnack.id = nextSnackId++;
  snackRacks.push(newSnack);
});

app.get('/snacks/:snackId', (req, res, next) => {
  res.send(snackRacks);
});

app.put('/snacks/:snackId', (req, res, next) => {
  const updatedSnack = req.body.snackRack;
  if (req.snackRack.id) {
    res.status(400).send('Cannot update snack rack id');
  } else {
    snackRacks[req.snackRackIndex] = updatedSnack;
    res.send(snackRacks[req.snackRackIndex]);
  }
});

app.delete('/snacks/:snackId', (req, res, next) => {
  snackRacks.splice(req.snackRackIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const vendingMachine = [
  {
    id: 1,
    name: 'Gum',
    price: 1.25,
  },
  {
    id: 7,
    name: 'Bag of chips',
    price: 3.50,
  },
  {
    id: 23,
    name: 'cumin',
    price: .75,
  }
];

let nextSnackId = 24;

app.use(bodyParser.json());

// Add your code here:
app.param('snackId', (req, res, next, id) => {
  const snackId = Number(id);
  const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
  if (snackIndex === -1) {
    res.status(404).send('Snack not found!');
  } else {
    req.snackIndex = snackIndex;
    next();
  }
});

app.get('/snacks/', (req, res, next) => {
  res.send(vendingMachine);
});

app.post('/snacks/', (req, res, next) => {
  const newSnack = req.body;
  if (!newSnack.name || !newSnack.price) {
    res.status(400).send('Snack not found!');
  } else {
    newSnack.id = nextSnackId++;
    vendingMachine.push(newSnack);
    res.send(newSnack);
  }
});

app.get('/snacks/:snackId', (req, res, next) => {
  res.send(vendingMachine[req.snackIndex]);
});

app.put('/snacks/:snackId', (req, res, next) => {
  vendingMachine[req.snackIndex] = req.body;
  res.send(vendingMachine[req.snackIndex]);
});

app.delete('/snacks/:snackId', (req, res, next) => {
  vendingMachine.splice(req.snackIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});