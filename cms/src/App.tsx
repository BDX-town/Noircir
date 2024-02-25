import { AppContextProvider, useAppContext } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Base } from './layout/Base';
import { Write } from './layout/Write';
import { TranslationContext } from '@bdxtown/canaille';
import '@mdxeditor/editor/style.css';
// import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


import { Login } from './views/Login';
import { Posts } from './views/Posts';
import { ErrorElement } from './bits/ErrorElement';
import { BlogLocation, PostsLocation, PostLocation, MediaLocation, SettingsLocation } from './views/Locations';
import { Post } from './views/Post';


const baseRouter = createBrowserRouter([
  {
    path: '*',
    element: <Login />
  }
]);

const loggedRouter = createBrowserRouter([
  {
    path: PostLocation.path + "/*",
    element: <Write />,
    children: [
      {
        path: ":file",
        lazy: async () => { const { Post } = await import('./views/Post'); return { Component: Post } },
        errorElement: <ErrorElement />
      },
      {
        index: true,
        element: <Post blank />,
        errorElement: <ErrorElement />
      }
    ]
  },
  {
    path: '/',
    element: <Base />,
    children: [
      {
        ...BlogLocation,
        lazy: async () => { const { Blog } = await import('./views/Blog'); return { Component: Blog } },
        errorElement: <ErrorElement />
      },
      {
        ...PostsLocation,
        element: <Posts />,
        errorElement: <ErrorElement />
      },

      {
        ...MediaLocation,
        lazy: async () => { const { Media } = await import('./views/Media'); return { Component: Media } },
        errorElement: <ErrorElement />
      },
      {
        ...SettingsLocation,
        lazy: async() => { const { Settings } = await import('./views/Settings'); return { Component: Settings }},
        errorElement: <ErrorElement />
      },
      {
        index: true,
        element: <Navigate to={PostsLocation.path} replace />
      }
    ]
  }
]);

const Routing = () => {
  const { client } = useAppContext();
  if(!client) return <RouterProvider router={baseRouter} />
  return <RouterProvider router={loggedRouter} />
}


function App() {
  return (
    <TranslationContext
      defaultLang='fr-FR'
      __={translate}
    >
        <AppContextProvider>
          <ErrorBoundary>
              <Routing />
          </ErrorBoundary>
        </AppContextProvider>
    </TranslationContext>
  )
}

export default App
