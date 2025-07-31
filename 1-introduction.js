/*
When building interfaces with Express we will run into the pattern of expecting certain information in a requested URL
and using that information to identify the data that is being requested.
To give an example:
*/
app.get('/sorcerers/:sorcererName', (req, res, next) => {
    const sorcerer = Sorcerers[req.params.sorcererName];
    res.send(sorcerer.info);
});

app.get('/sorcerers/:sorcererName/spellHistory', (req, res, next) => {
    const sorcerer = Sorcerers[req.params.sorcererName];
    const spellHistory = Spells[sorcerer.id].history;
    res.send(spellHistory);
})
/*
In the above code we need to extract the request parameter [:sorcererName] from the URL in both instances
and end up duplicating the necessary code so that it appears in both routes.
When working with routes that require parameters,
we might find ourselves in a position where multiple different routes require the same parameter and use it to identify the same piece of data.
While writing this duplicate code will get the job done, 
copy and pasting functionality does leave a bitter taste in the mouth of the principled developer.
We should investigate if there is a better way to accomplish this.
*/

/*

*/

/*

*/

/*

*/

/*************************************************************************************************************************************************/