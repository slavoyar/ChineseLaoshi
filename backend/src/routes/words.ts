import { wordService } from '@services/wordService';

import { createRouter, Ok } from './createRouter';

const { router, createRoute } = createRouter('/words');

createRoute(async (req) => {
  const words = await wordService.search(req.query.search);
  return Ok(words);
});

export default router;
