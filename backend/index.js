import express from 'express';
const app = express();
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import router from './football.js';

//Parsing URL encoded data
app.use(urlencoded({ extended: false }));

//Parsing json data
app.use(json());

app.use('/football', router);

app.listen(3000);






