import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import dbConnect from './Db/mongoConnect';
import errorHandler from './Middleware/errorHandler';
//import swaggerDocs from '../swagger1';
import swaggerDocs from './swagger';
import testRoutes from './Routes/test/testRoutes'
import eventRoutes from './Routes/eventRoutes'
import adminRoutes from './Routes/adminRoutes'
import userLoginLogs from './Routes/userLogingRoutes'
import peerRoutes from './Routes/peersRoutes'
import morgan from 'morgan';
import { apiLogger,errorLogger } from './Helper/wistonConfig';
import config from './Helper/config';
dotenv.config();

const PORT: string = process.env.PORT || config.port;

const app = express();

// app.use(
//     morgan('combined', {
//       stream: {
//         write: (message: string) => {
//           apiLogger.info(message.trim());
//         },
//       },
//     })
// );

app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => {
          console.log(message.trim());
          apiLogger.info(message.trim());
        },
      },
    })
  );
  
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }));
app.use(express.json())

app.use(cookieParser())

app.use(bodyParser.json())

dbConnect();



/**
 * @openapi
 * /deleteUserById/{id}:
 *   delete:
 *     summary: delete user by id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id of the user to be deleted.
 *     responses:
 *       200:
 *         description: user is deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedUser:
 *                   $ref: '#/components/schemas/AddUserRequestBody'
 *       401:
 *         description: No user found with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errorobj:
 *                   type: object
 */



app.get("/",(req,res)=>{
    res.send("Home")
})

app.use(testRoutes);
app.use(eventRoutes)
app.use(userLoginLogs)
app.use(adminRoutes)
app.use(peerRoutes)
app.use(errorHandler);


swaggerDocs(app)



app.listen(PORT,()=>{
    console.log(`app is started on http://localhost:${PORT}/`)
})
