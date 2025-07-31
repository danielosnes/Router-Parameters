const { appendFile } = require("fs");

/*
Complexity is all around us.
Buildings are made from bricks and many droplets of water make a cloud.
When we want to create something complex in software,
we model out our base components and use #composition to create these relationships.

When we're building web endpoints, we might want to access som eperopert of a complex object.
In order to do this in Express, we can design a nested router.
This would be a router that is invoked within another router.
In order to pass parameters the parent router has access to,
we pass a special configuration object when defining the router
*/
const sorcererRouter = express.Router();
const familiarRouter = express.Router({mergeParams: true});

sorcererRouter.use('/sorcererId/familiars', familiarRouter);

sorcererRouter.get('/', (req, res, next) => {
    res.status(200).send(Sorcerers);
    next();
});

sorcererRouter.param('sorcererId', (req, res, next) => {
    const sorcerer = getSorcererById(id);
    req.sorcererId = sorcerer;
    next();
});

familiarRouter.get('/', (req, res, next) => {
    res.status(200).send(`Sorcerer ${req.sorcerer} has familiars ${getFamiliars(sorcerers)}`);
});

app.use('/sorcerer', sorcererRouter);
/*
In the code above we define two endpoints:
[/sorcerer] and [/sorcerer/:sorcererId/familiars]
The familiars are nexted into the sorcerer endpoint
- indicating the relationshop that a sorcerer has multiple familiars.
Take careful note of the [{mergeParameters: true}] argument that gets passed when creating the [familiarRouter].
This argument tells Express that the [familiarRouter] should have access to parameters pass into it's /parent/ router, that is, the [sorcererRouter].
We then tell express that the path for the [familiarRouter] is the same as the path for the [sorcererRouter] with the additional path [/:sorcererId/familiars]
We then can create a family of routes (a router) built by appending routes to [familiarRouter]'s base:
[/sorcerer/:sorcererId/familiars]
*/
/*************************************************************************************************************************************************/
/*
Instructions
Checkpoint 1 Passed
1.
Let’s make our spices API more flexible and allow spices to be associated with different spice racks. 
The goal for this exercise will be to ensure that when new spices are created or updated, they will be associated with the correct spice rack.

In the workspace, you have a new root app.js file and a spicesRouter.js with code from the last exercise. 
app.js will handle interactions retrieving, creating, updating, and deleting spice racks, 
and spicesRouter.js will be nested to handle individual spices with the spice racks. 
Each file has a param method call (app.param in app.js, router.param in spicesRouter.js).

To begin, let’s hook the router up to the main application. 
At the end of app.js, use the spicesRouter for all /spice-racks/:spiceRackId/spices routes.

Checkpoint 2 Passed
2.
Now, let’s make sure that the spicesRouter is merging parameters from parent app.js Express instance. 
Add the proper options to the .Router() method at the top of your spicesRouter.js file.

Checkpoint 3 Passed
3.
Okay, now let’s make sure that newly created spices inside spicesRouter.js are associated with the correct spice rack. 
Inside your .post() route, make sure to set the newSpice.spiceRackId equal to the req.params.spiceRackId that the parent router attached 
if mergeParams has performed as expected. Don’t forget to convert the spiceRackId to a number before attaching it. 
Make sure to set this before it is pushed onto the spices array.
*/
/*************************************************************************************************************************************************/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());

const spiceRacks = [
  {
    id: 1,
    location: 'Kitchen Countertop',
  },
  {
    id: 2,
    location: 'Pantry',
  },
  {
    id: 3,
    location: 'Outdoor Barbecue',
  }
];

let nextSpiceRackId = 4;

app.param('spiceRackId', (req, res, next, id) => {
  const idToFind = Number(id);
  const rackIndex = spiceRacks.findIndex(spiceRack => spiceRack.id === idToFind);
  if (rackIndex !== -1) {
    req.spiceRack = spiceRacks[rackIndex];
    req.spiceRackIndex = rackIndex;
    next();
  } else {
    res.status(404).send('Spice Rack Not Found.');
  }
});

app.get('/spice-racks/', (req, res, next) => {
 res.send(spiceRacks);
});

app.post('/spice-racks/', (req, res, next) => {
  const newRack = req.body.spiceRack;
  newRack.id = nextSpiceRackId++;
  spiceRacks.push(newRack);
  res.send(newRack);
});

app.get('/spice-racks/:spiceRackId', (req, res, next) => {
  res.send(req.spiceRack);
});

app.put('/spice-racks/:spiceRackId', (req, res, next) => {
  const updatedRack = req.body.spiceRack;
  if (req.spiceRack.id !== updatedRack.id) {
    res.status(400).send('Cannot update Spice Rack Id');
  } else {
    spiceRacks[req.spiceRackIndex] = updatedRack;
    res.send(spiceRacks[req.spiceRackIndex]);
  }
});

app.delete('/spice-racks/:spiceRackId', (req, res, next) => {
  spiceRacks.splice(req.spiceRackIndex, 1);
  res.status(204).send();
});

const spicesRouter = require('./spicesRouter');

// Write your code below:
app.use('/spice-racks/:spiceRackId/spices', spicesRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
