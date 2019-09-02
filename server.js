const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
//console.log(process.env);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`App is ready on : http://127.0.0.1:${port}`)
);
