import { RouterProvider } from './app/providers/RouterProvider';
import { StoreProvider } from './app/providers/StoreProvider';
import './app/styles/globals.css';

function App() {
  return (
    <StoreProvider>
      <RouterProvider />
    </StoreProvider>
  );
}

export default App;
