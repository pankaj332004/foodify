import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
            },
            error: {
              duration: 5000,
              style: {
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FECACA',
              },
            },
            success: {
              style: {
                background: '#F0FDF4',
                color: '#14532D',
                border: '1px solid #BBF7D0',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
