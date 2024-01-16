import { AppContextProvider } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Base } from './layout/Base';
import { TranslationContext } from '@bdxtown/canaille';
import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


function App() {
  return (
    <TranslationContext
      defaultLang='fr-FR'
      __={translate}
    >
      <ErrorBoundary>
        <AppContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Base />}>
                <Route index element={<>coucou</>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </ErrorBoundary>
    </TranslationContext>
  )
}

export default App
