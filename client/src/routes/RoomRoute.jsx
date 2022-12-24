import { Card, List } from 'antd';
import { useEffect, useState } from 'react';
import CountdownTag from '../components/CountdownTag';

const API_EVENTS_URL = new URL('/sse', process.env.API_URL).pathname;

function RoomRoute() {
  const [data, setData] = useState(null);

  const handleRoomStatus = (event) => {
    setData(JSON.parse(event.data));
  };

  useEffect(() => {
    const eventSource = new EventSource(API_EVENTS_URL);

    eventSource.addEventListener('ROOM:STATUS', handleRoomStatus);

    return () => {
      eventSource.removeEventListener('ROOM:STATUS', handleRoomStatus);
    };
  }, []);

  const isLoading = !data;

  return (
    <Card title={isLoading ? 'Подключение...' : 'Список участников'} bordered={false} style={{ width: 500 }}>
      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={!isLoading ? data.clients : undefined}
        renderItem={({ id, name, companyName }) => (
          <List.Item>
            <List.Item.Meta title={name} description={companyName} />

            {id === data.activeClientId && <CountdownTag count={data.timeLeft} />}
          </List.Item>
        )}
      />
    </Card>
  );
}

export default RoomRoute;
