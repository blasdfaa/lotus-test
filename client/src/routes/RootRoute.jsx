import { Button, Card, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_PAGE } from '../utils/paths';

const { Title, Text } = Typography;

function RootRoute() {
  const navigate = useNavigate();

  return (
    <Card style={{ width: 440, textAlign: 'center' }} bordered={false}>
      <Space direction="vertical" size="large">
        <Space direction="vertical" size="small">
          <Title level={2} style={{ margin: 0 }}>
            Тестовое задание для компании ЛОТОС
          </Title>
          <Text type="secondary">Для демонстрации работы таймера будут добавлены 3 тестовых участника</Text>
        </Space>

        <Button onClick={() => navigate(PATH_PAGE.room(1))} type="primary" size="large" block>
          Войти в комнату
        </Button>
      </Space>
    </Card>
  );
}

export default RootRoute;
