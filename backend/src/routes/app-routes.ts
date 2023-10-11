import express from 'express';
import linkController from '../controllers/app-controller';
export const router = express.Router();

router.get('/', (req, res) => {});
router.post('/shrinkUrl', linkController.shrinkUrl);
router.post('/addLink', linkController.addLink);
router.get('/getLinkByUrl', linkController.getLinkByUrl);
router.get('/getLinkByShortUrl', linkController.getLinkByShortUrl);
router.post('/login', linkController.checkUser);
router.post('/register', linkController.addUser);
router.post('/api/google-auth', linkController.checkUserWithGoogle);

export default router;
