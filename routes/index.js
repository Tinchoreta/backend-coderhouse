import { Router } from "express"
import apiRouter from './api/index.js'
import viewsRouter from './views/index.js'

const router = Router();



router.use('/api',apiRouter);
router.use('/views',viewsRouter);

// router.stack.forEach(({ route, path, name }) => {
//     if (route) {
//       console.log(`Ruta: ${route.path}, método: ${route.stack[0].method}`);
//     } else if (path && name === 'router') {
//       console.log(`Rutas montadas por el router en: ${path}`);
//     } else {
//       console.log('Ruta no definida');
//     }
//   });

export default router;