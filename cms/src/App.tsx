import { AppContextProvider, useAppContext } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Base } from './layout/Base';
import { TranslationContext } from '@bdxtown/canaille';
// import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


import { Posts, Location as PostsLocation } from './views/Posts';
import { Post, Location as PostLocation } from './views/Post';
import { Login, Location as LoginLocation } from './views/Login';
import { Blog, Location as BlogLocation } from './views/Blog';
import { Media, Location as MediaLocation } from './views/Media';

const Routing = () => {
  const { client } = useAppContext();
  return (
    <Routes>
        <Route { ...LoginLocation } element={<Login />} />
        {
        !client ? (
          <>
            <Route
                path="*"
                element={<Navigate to={LoginLocation.path} replace />}
            />
          </>
        ) : (
          <Route path="/" element={<Base />}>
            <Route {...BlogLocation} element={<Blog />} />
            <Route {...PostsLocation} element={<Posts />} />
            <Route {...PostLocation} element={<Post />} />
            <Route {...MediaLocation} element={<Media />} />
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
        <AppContextProvider>
          <ErrorBoundary>
              <BrowserRouter>
                <Routing />
              </BrowserRouter>
          </ErrorBoundary>
        </AppContextProvider>
    </TranslationContext>
  )
}

export default App
