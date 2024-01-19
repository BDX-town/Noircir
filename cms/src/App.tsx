import { AppContextProvider } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Base } from './layout/Base';
import { TranslationContext } from '@bdxtown/canaille';
import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


import { Posts, Location as PostsLocation } from './views/Posts';
import { Post, Location as PostLocation } from './views/Post';

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
                <Route {...PostsLocation} element={<Posts />} />
                <Route {...PostLocation} element={<Post />} />
                <Route
                    index
                    element={<Navigate to={PostsLocation.path} replace />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </ErrorBoundary>
    </TranslationContext>
  )
}

export default App
