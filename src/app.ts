import express from 'express';
import cors from 'cors';
import globalErrorHander from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import route from './app/routes';
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['https://animation-lilac-phi.vercel.app', 'http://localhost:3000'],
  }),
);
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hello World',
  });
});
app.use('/api', route);
app.use(globalErrorHander);
app.use(notFound);

export default app;
