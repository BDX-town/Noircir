import { AppContextProvider, useAppContext } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Base } from './layout/Base';
import { TranslationContext } from '@bdxtown/canaille';
import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


import { Posts, Location as PostsLocation } from './views/Posts';
import { Post, Location as PostLocation } from './views/Post';
import { Login, Location as LoginLocation } from './views/Login';

const Routing = () => {
  const { client } = useAppContext();
  return (
    <Routes>
        {
        !client ? (
          <>
            <Route { ...LoginLocation } element={<Login />} />
            <Route
                path="*"
                element={<Navigate to={LoginLocation.path} replace />}
            />
          </>
        ) : (
          <Route path="/" element={<Base />}>
            <Route {...PostsLocation} element={<Posts />} />
            <Route {...PostLocation} element={<Post />} />
            <Route path="post" element={<Post blank />} />
            <Route
                index
                element={<Navigate to={PostsLocation.path} replace />}
            />
          </Route>
        )
      }

    </Routes>
  )
}

function App() {
  return (
    <TranslationContext
      defaultLang='fr-FR'
      __={translate}
    >
      <ErrorBoundary>
        <AppContextProvider>
          <BrowserRouter>
            <Routing />
          </BrowserRouter>
        </AppContextProvider>
      </ErrorBoundary>
    </TranslationContext>
  )
}

export default App
