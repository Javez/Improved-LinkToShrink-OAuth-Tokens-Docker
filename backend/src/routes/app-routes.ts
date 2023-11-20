import express from 'express';
import linkController from '../controllers/app-controller';
import { verifyToken } from '../middleware/auth/auth';

export const router = express.Router();

router.post('/login/user', linkController.checkUser);
router.post('/register/user', linkController.addUser);
router.post('/auth/googleuser', linkController.checkGoogleUser);
router.get('/', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Protected resource' });
});
router.post('/shrinkUrl', verifyToken, linkController.shrinkUrl);
router.post('/addLink', verifyToken, linkController.addLink);
router.get('/getLinkByUrl', verifyToken, linkController.getLinkByUrl);
router.get('/getLinkByShortUrl', verifyToken, linkController.getLinkByShortUrl);

export default router;
