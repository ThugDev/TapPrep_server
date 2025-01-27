import { body, query, validationResult } from 'express-validator';
const errHandler = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Parameter validation failed. You can find the reason at |errors|',
      errors: err.array(),
    });
  }
  next();
};

export const paramsValidator = {
  auth: {
    oAuthLogin: [body('code').notEmpty().withMessage('Not found parameter |code|'), errHandler],
    refresh: [
      body('username').notEmpty().withMessage('Not found parameter |username|'),
      body('refreshToken').notEmpty().withMessage('Not found parameter |refreshToken|'),
      errHandler,
    ],
  },
  problems: {
    createProblem: [
      body('sector').notEmpty().withMessage('Not found parameter |sector|'),
      body('type').notEmpty().withMessage('Not found parameter |type|'),
      body('difficulty').notEmpty().withMessage('Not found parameter |difficulty|'),
      body('title').notEmpty().withMessage('Not found parameter |title|'),
      body('description').notEmpty().withMessage('Not found parameter |description|'),
      body('answer').notEmpty().withMessage('Not found parameter |answer|'),
      body('hint').notEmpty().withMessage('Not found parameter |hint|'),
      body('explanation').notEmpty().withMessage('Not found parameter |explanation|'),
      body('reference').notEmpty().withMessage('Not found parameter |reference|'),
      errHandler,
    ],
    getLists: [
      query('sector').notEmpty().withMessage('Not found parameter |sector|'),
      query('type').notEmpty().withMessage('Not found parameter |type|'),
      query('difficulty').notEmpty().withMessage('Not found parameter |difficulty|'),
      query('page').notEmpty().withMessage('Not found parameter |page|'),
      query('limit').notEmpty().withMessage('Not found parameter |limit|'),
      errHandler,
    ],
    getAnswer: [
      body('problemId').notEmpty().withMessage('Not found parameter |problemId|'),
      body('optionId').notEmpty().withMessage('Not found parameter |optionId|'),
      errHandler,
    ],
  },
};
