import express from 'express';
import pg from 'pg';
const { Pool } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'yctang',
  host: 'localhost',
  database: 'birding',
  port: 5432, // Postgres server always runs on this port
};

// create the var we'll use
const pool = new Pool(pgConnectionConfigs);
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
// app.use(methodOverride('_method'));

// Render the form to input new notes
app.get('/note', (request, response) => {
    response.render('note');
  });

// Save new notes data sent via POST requqest from our form

app.post('/note', (request, response) => {
  const inputData =  Object.values(request.body)

  console.log(Object.values(request.body));

  const sqlQuery = 'INSERT INTO notes (date, habitat, flock_size, appearance, vocalisations, behaviour_id, species_id, user_idnum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
 
 pool.query(sqlQuery, inputData, (err, result) => {
   if (err || result.rows.length === 0) {
     console.log(err);
   }
   response.redirect(301, "/");
 });
 
});

app.get('/', (request, response) => {
  const allQuery = 'SELECT * FROM notes';

  pool.query(allQuery, (error, result) => {
    if (error || result.rows.length === 0) {
      console.error(error, result, response);
    }
    let printAllNotes = result.rows;
      console.log('This is printAllNotes',printAllNotes)
    response.render('landing-page', { printAllNotes });
  })
});

app.get('/note/:id', (request, response) => {
  const { id } =  request.params;
  const idQuery = `SELECT * FROM notes where id=${id}`;

  pool.query(idQuery, (error, result) => {
    if (error || result.rows.length === 0) {
      console.error(error, result, response);
    }
    let idQuery = result.rows[0];
      console.log('This is idQuery',idQuery)
    response.render('single-page', { idQuery });
  })
});



////////////
// ROUTES //
///////////


app.listen(3004);

// // run the SQL query
// client.query(recipeQuery, (recipeQueryError, recipeQueryResult) => {
//   // this error is anything that goes wrong with the query
//   if (recipeQueryError) {
//     console.error('recipe query error', recipeQueryError);
//     client.end();
//     return;
//   }

//   // rows key has the data
//   console.log(recipeQueryResult.rows);

//   // return early if no results
//   if (recipeQueryResult.rows.length <= 0) {
//     console.log('no results!');
//     client.end();
//     return;
//   }

//   // extract the recipe that we queried for
//   const recipe = recipeQueryResult.rows[0];

//   // MAGIC: use the result of the 1st query in the 2nd
//   const categoryQuery = `SELECT * FROM categories WHERE id=${recipe.category_id}`;

//   client.query(categoryQuery, (categoryQueryError, categoryQueryResult) => {
//     // this error is anything that goes wrong with the query
//     if (categoryQueryError) {
//       console.error('category query error', categoryQueryError);
//       client.end();
//       return;
//     }

//     // rows key has the data
//     console.log(categoryQueryResult.rows);

//     // close the connection
//     client.end();
//   });
// });