import express from 'express';
import * as memberC from '../controllers/memberController.js'

const router = express.Router();

router.post('/members', memberC.postMember)
router.post('/members/login', memberC.loginMember)
router.get('/members/logout', memberC.logoutMember)

export default router