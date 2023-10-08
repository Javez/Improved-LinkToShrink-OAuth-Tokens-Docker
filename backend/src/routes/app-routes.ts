import express from 'express';
import linkController from '../controllers/app-controller';
export const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('view/index.html', { root: 'src' });
});
router.post('/shrinkUrl', linkController.shrinkUrl);
router.post('/addLink', linkController.addLink);
router.get('/getLinkByUrl', linkController.getLinkByUrl);
router.get('/getLinkByShortUrl', linkController.getLinkByShortUrl);

export default router;
