/*
Express, luckily, is mindful of the pain-point of replicated parameter-matching code and has a method specifically for this issue.
When a specific #parameter is present in a route,
we can write a function that will perform the necessary lookup and attach it to the [req] object in the subsequent middleware.
*/
app.param('spellId', (req, res, next, id) => {
    let spellId = Number(id);
    try {
        const found = SpellBook.find((spell) => {
            return spellId = spell.id;
        })
        if (found) {
            req.spell = found;
            next();
        } else {
            next(new Error('Your magic spell was not found in any of our tomes'));
        };
    } catch (err) {
        next(err)
    }
});
/**
 * In the above code we intercept any request to a route handler with the [:spellId] parameter.
 * Note that in the [app.param] function signature, ['spellId'] does not have the leading [:].
 * The actial ID will be passed in as the fourth argument,
 * [id] in this case,
 * to the [app.param] callback function when a request arrives.
*/

/**
 *We look up the spell in our [SpellBook] #array using the [.find()] method.
 *if [SpellBook] does not exist or some other error is thrown in this process,
 * we pass the error to the following middleware (hopefully we've written some error-handling middleware or included some external)
 * If the [spell] exists in [SpellBook], the [.find()] method will store the spell in [found],
 * and we attach it as a property of the request object
 * (so future routes can reference it via [req.spell].)
 * If the requested [spell] does not exist, [.find()] will store [undefined] in [found],
 * and we let future middlewares know there was an error in the request by creating a new [Error] object and passing it to [next()].
*/

/*
Note that inside an [app.param] callback,
you should use the fourth argument as the parameters value,
not a key from the [req.params] object.
*/
/*************************************************************************************************************************************************/
/*
//before:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const spiceRack = [
  {
    id: 1,
    name: 'cardamom',
    grams: 45,
  },
  {
    id: 2,
    name: 'pimento',
    grams: 20,
  },
  {
    id: 3,
    name: 'cumin',
    grams: 450,
  },
  {
    id: 4,
    name: 'sichuan peppercorns',
    grams: 107,
  }
];

let nextSpiceId = 5;

app.use(bodyParser.json());

// Add your code here:



app.get('/spices/', (req, res, next) => {
  res.send(spiceRack);
});

app.post('/spices/', (req, res, next) => {
  const newSpice = req.body.spice;
  if (newSpice.name  && newSpice.grams) {
    newSpice.id = nextSpiceId++;
    spiceRack.push(newSpice);
    res.send(newSpice);
  } else {
    res.status(400).send();
  }
});

app.get('/spices/:spiceId', (req, res, next) => {
  const spiceId = Number(req.params.id);
  const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);
  if (spiceIndex !== -1) {
    res.send(spiceRack[spiceIndex]);
  } else {
    res.status(404).send('Spice not found.');
  }
});

app.put('/spices/:spiceId', (req, res, next) => {
  const spiceId = Number(req.params.id);
  const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);
  if (spiceIndex !== -1) {
    spiceRack[spiceIndex] = req.body.spice;
    res.send(spiceRack[spiceIndex]);
  } else {
    res.status(404).send('Spice not found.');
  }
});

app.delete('/spices/:spiceId', (req, res, next) => {
  const spiceId = Number(req.params.id);
  const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);
  if (spiceIndex !== -1) {
    spiceRack.splice(spiceIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Spice not found.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/
/*************************************************************************************************************************************************/
/*
Instructions
Checkpoint 1 Passed
1.
Let’s refactor this code to use app.param for all /spices/:spiceId routes.

First, start your code with a call to app.param. 
Write functionality that will look for the spiceIndex and attach it to the req object as req.spiceIndex if it exists. 
Call next after that. 
If it does not exist, send a 404 error response and do not call next.

Checkpoint 2 Passed
2.
Now, refactor your current code to get rid of any index-checking logic in /spices/:spiceId routes. 
Use req.spiceIndex to do any necessary operations on the spiceRack object. 
You should also get rid of anything that would send an error response, as non-existent ids will already have been handled by router.param.
*/
/*************************************************************************************************************************************************/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const spiceRack = [
  {
    id: 1,
    name: 'cardamom',
    grams: 45,
  },
  {
    id: 2,
    name: 'pimento',
    grams: 20,
  },
  {
    id: 3,
    name: 'cumin',
    grams: 450,
  },
  {
    id: 4,
    name: 'sichuan peppercorns',
    grams: 107,
  }
];

let nextSpiceId = 5;

app.use(bodyParser.json());

// Add your code here:
app.param('spiceId', (req, res, next, id) => {
  const spiceId = Number(id);
    const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);

    if (spiceIndex !== -1){
      req.spiceIndex = spiceIndex;
      next();
    } else {
      res.sendStatus(404);
    }
})


app.get('/spices/', (req, res, next) => {
  res.send(spiceRack);
});

app.post('/spices/', (req, res, next) => {
  const newSpice = req.body.spice;
  if (newSpice.name  && newSpice.grams) {
    newSpice.id = nextSpiceId++;
    spiceRack.push(newSpice);
    res.send(newSpice);
  } else {
    res.status(400).send();
  }
});

app.get('/spices/:spiceId', (req, res, next) => {
    res.send(spiceRack[req.spiceIndex]);
});

app.put('/spices/:spiceId', (req, res, next) => {
    spiceRack[req.spiceIndex] = req.body.spice;
    res.send(spiceRack[req.spiceIndex]);
});

app.delete('/spices/:spiceId', (req, res, next) => {
    spiceRack.splice(req.spiceIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});