import { Router } from 'express';
import {
  getOrCreateUser,
  updateCredits,
  getCredits,
  checkCredits
} from '../../controllers/credits/index.controller';

const CreditRouter = Router();

CreditRouter.get('/:id', getOrCreateUser);
CreditRouter.get('/:id/credits', getCredits);
CreditRouter.put('/update-credits', updateCredits);
CreditRouter.post('/check-credits', checkCredits);

export default CreditRouter;
