import { Router } from 'express';
import { stockData, HistoricalData, stockSearch } from '../controllers/Stocks.Controller.js';

const router = Router();

router.get('/stockdata/search', stockSearch);

router.get('/intraday/:symbol', stockData);

router.get('/historical/:symbol/:day', HistoricalData);

export default router;
