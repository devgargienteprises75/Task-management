import { createRoot } from 'react-dom/client'
import './app/App.css'
import App from './app/App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/app.store.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
