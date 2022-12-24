import { HourglassOutlined } from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import PropTypes from 'prop-types';

import d from '../lib/date';

const { Text } = Typography;

function CountdownTag({ count }) {
  const timer = d.duration(count, 'seconds').format('mm:ss');

  return (
    <Tag
      color="blue"
      icon={<HourglassOutlined style={{ fontSize: 18 }} spin />}
      style={{ display: 'flex', placeItems: 'center' }}
    >
      <Text style={{ fontSize: 19 }}>{timer}</Text>
    </Tag>
  );
}

CountdownTag.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CountdownTag;
