import app from './config/express.config';
import { APP } from './config/env.config';
import logger from './config/winston.config';

const { port } = APP;

const server = app.listen(port, () => logger.info(`Server started on port: ${port}`));

export default server;
