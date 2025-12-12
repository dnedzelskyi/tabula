import './styles/main.css';
import { ClockComponent, AlertComponent, NoteComponent } from './components';
import { StorageService } from './services/storage';
import TabulaApp from './modules/application';

document.addEventListener('DOMContentLoaded', async () => {
  TabulaApp.builder
    .registerComponents([NoteComponent, ClockComponent, AlertComponent])
    .registerService(StorageService, new StorageService(window.localStorage))
    .create()
    .run();
});
