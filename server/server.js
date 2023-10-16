import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './Database/connection.js'; /**dont forget .js extension in backend otherwise error message */
import router from './Router/route.js';


const app= express();

/**middleware */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack


const port=8080;

/**HTTP GET request */
app.get('/',(req,res)=>{
    res.status(201).json('Home GET request');
});

/**api routes */
app.use('/api',router)


/**start server only we have valid connection*/

connect().then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`Server connected to http://localhost:${port}`);
        }) 
    } catch (error) {
        console.log('Cannot connect to server');
    }
}).catch(error=>{
    console.log('Invalid database connection..!');
})
