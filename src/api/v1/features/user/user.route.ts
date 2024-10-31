import { Router } from 'express';

const router = Router();
export { router as userRoute };

router.get('/', (req, res) => {
    res.send('Hello World!');
});
