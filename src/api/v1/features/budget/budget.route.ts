import { Router } from 'express';

const router = Router();
export { router as budgetRoute };

router.get('/', (req, res) => {
    res.send('Hello World!');
});
