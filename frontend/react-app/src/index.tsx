import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'rsuite/dist/rsuite.min.css';
import './index.css';
import EnvService from './services/EnvService';
import Auth0Wrapper from 'Auth0Wrapper';
import SessionStorageService from 'services/SessionStorageService';


const container = document.getElementById('root')!;
const root = createRoot(container);

EnvService.application = () => {
  /* eslint-disable-next-line */
  SessionStorageService.instance;

  root.render(
    <Auth0Wrapper>
      <App />
    </Auth0Wrapper>
  );
}

/* eslint-disable-next-line */
EnvService.instance;


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
