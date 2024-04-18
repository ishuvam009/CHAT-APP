import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import connectToMongoDB from './db/connectToMongodb.js';
import exp from 'constants';

const app = express();
const PORT = process.env.PORT || 5600;

dotenv.config();

app.use(express.json());

app.use('/api/auth',authRoutes);

// app.get('/',(req,res) => {
//     res.send('Hello')
// });



app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`App is running at port ${PORT}.`);
});

