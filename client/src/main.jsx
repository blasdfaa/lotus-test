import './index.css';
import './App.css';
import 'antd/dist/reset.css';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorScreen from './components/ErrorScreen';
import RootRoute from './routes/RootRoute';
import RoomRoute from './routes/RoomRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <ErrorScreen />,
  },
  {
    path: 'rooms/:roomId',
    element: <RoomRoute />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
