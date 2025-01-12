import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

const authController = new AuthController();
router.use('/git', authController.oAuthLogin);
