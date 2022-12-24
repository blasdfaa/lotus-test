import { faker } from '@faker-js/faker/locale/ru';
import { ServerEvents } from './config.js';

const RETRY_CONNECTION_TIME = 5000;
export const CLIENT_ROUND_TIME = 120; // в секундах

export const createClient = (response) => {
  const clientId = Date.now();

  return {
    id: clientId,
    name: `Участник №${clientId}`,
    companyName: faker.company.name(),
    response,
  };
};

export const addClient = (clients, client) => {
  clients.set(client.id, client);
};

export const removeClient = (clients, clientId) => {
  clients.delete(clientId);
};

const serializeState = (state) => {
  const clients = Array.from(state.clients, ([clientId, client]) => {
    return { id: clientId, name: client.name, companyName: client.companyName };
  });

  return JSON.stringify({
    ...state,
    clients,
  });
};

export const sendRoomEvents = (state) => {
  // const now = new Date().getTime();
  // console.log('now: ', now);

  state.clients.forEach((client) => {
    if (client.response === null) {
      return;
    }

    // записываем данные в ответ
    // client.response.write(`id: ${eventId}\n`);
    client.response.write(`event: ${ServerEvents.ROOM_STATUS}\n`); // Важно указать это на клиенте. Подписчиков этого ивента сервер будет оповещать
    client.response.write(`data: ${serializeState(state)}\n\n`);
    client.response.write(`retry: ${RETRY_CONNECTION_TIME}\n`);
    // API: https://developer.mozilla.org/ru/docs/Web/API/Server-sent_events/Using_server-sent_events
  });
  console.info('User data has been sent, clients count: ', state.clients.size);
};

export const activateNextClient = (state) => {
  const clientsIds = [...state.clients.keys()];
  let activeClientIdIndex = clientsIds.indexOf(state.activeClientId);

  state.timeLeft = CLIENT_ROUND_TIME;
  activeClientIdIndex += 1;

  state.activeClientId = clientsIds[activeClientIdIndex % clientsIds.length]; // Выбрать айди клиента, но не за пределами массива
};

export const roundTick = (state) => {
  state.timeLeft -= 1;

  if (state.timeLeft === 0) {
    activateNextClient(state);
  }
};
