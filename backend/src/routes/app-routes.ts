import express from 'express';
import linkController from '../controllers/app-controller';
import { createToken, verifyToken } from '../middleware/auth/auth';
export const router = express.Router();

router.post('/login', linkController.checkUser);
router.post('/register', linkController.addUser);
router.get('/', verifyToken, (req, res) => {
    res.json({ success: true, message: 'Protected resource' });
});
router.post('/shrinkUrl', verifyToken, linkController.shrinkUrl);
router.post('/addLink', verifyToken, linkController.addLink);
router.get('/getLinkByUrl', verifyToken, linkController.getLinkByUrl);
router.get('/getLinkByShortUrl', verifyToken, linkController.getLinkByShortUrl);
router.post('/api/google-auth', verifyToken, linkController.checkUserWithGoogle);


export default router;