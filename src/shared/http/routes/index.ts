import { Router } from 'express';

const routes = Router();

routes.get('/health', (request, reponse) => {
  return reponse.json({ message: 'Hello Dev! I am Alive! ' });
});

export default routes;
