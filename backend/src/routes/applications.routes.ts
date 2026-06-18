import { Router } from 'express';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applications.controller';

const router = Router();

router.get('/', getApplications);
router.get('/:id', getApplication);
router.post('/', createApplication);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
