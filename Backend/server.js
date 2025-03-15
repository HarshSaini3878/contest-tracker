import { config as configDotenv } from 'dotenv'; 
import express from 'express';

configDotenv(); 

const app = express();

app.listen(3000, () => console.log('Server running on port 3000'));
