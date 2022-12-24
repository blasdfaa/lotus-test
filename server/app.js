import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { faker } from '@faker-js/faker/locale/ru';
import {
  activateNextClient,
  addClient,
  CLIENT_ROUND_TIME,
  createClient,
  removeClient,
  roundTick,
  sendRoomEvents,
} from './room.js';
import { HttpCode } from './config.js';

const PORT = process.env.PORT || 3009;
const SEND_DATA_INTERVAL = 1000;
const DEFAULT_ACTIVE_CLIENT_ID = 1;

const state = {
  clients: new Map([
    [1, { name: 'Участник №1', companyName: faker.company.name(), response: null }],
    [2, { name: 'Участник №2', companyName: faker.company.name(), response: null }],
    [3, { name: 'Участник №3', companyName: faker.company.name(), response: null }],
  ]),
  activeClientId: DEFAULT_ACTIVE_CLIENT_ID,
  timeLeft: CLIENT_ROUND_TIME,
};

const bootstrap = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));

  // данные будут отправляться каждую секунду для всех клиентов
  setInterval(() => {
    roundTick(state);
    sendRoomEvents(state);
  }, SEND_DATA_INTERVAL);

  app.get('/sse', (req, res) => {
    res.writeHead(HttpCode.OK, {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });

    // Создать "аккаунт" участника и добавить в комнату
    const client = createClient(res);
    addClient(state.clients, client);

    // Завершить подключение клиента и удалить из участника комнаты
    req.on('close', () => {
      // Если отключённый клиент имеет активный ход, надо передать ход следующему по очереди клиенту
      if (client.id === state.activeClientId) {
        activateNextClient(state);
      }
      removeClient(state.clients, client.id);
      res.end('connection closed');
    });
  });

  app.get('*', (_req, res) => {
    res.status(HttpCode.NOT_FOUND).send('endpoint not found');
  });

  app.listen(PORT, () => {
    console.info(`server started on port ${PORT}`);
  });
};

bootstrap().catch((err) => console.error('err: ', err));
