import { Router } from 'express';
import { db } from '../../../../db/index.js';
import { authorizeRequest } from '../../../../helpers/auth.helpers.js';
import {
    createErrorResponse,
    createSuccessResponse
} from '../../../../helpers/response.helpers.js';

const router = Router();
export { router as userRoute };

router.get('/me', async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);

    const dbuser = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.id, user.userId)
    });

    if (!dbuser) {
        return res.status(404).json(createErrorResponse('User not found'));
    }

    res.status(200).json(
        createSuccessResponse({
            id: dbuser.id,
            name: dbuser.fullName,
            email: dbuser.email
        })
    );
});
