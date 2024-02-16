import { AppContextProvider, useAppContext } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Base } from './layout/Base';
import { TranslationContext } from '@bdxtown/canaille';
import '@mdxeditor/editor/style.css';
// import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


import { Login } from './views/Login';
import { Posts } from './views/Posts';
import { BlogLocation, PostsLocation, PostLocation, MediaLocation } from './views/Locations';


const baseRouter = createBrowserRouter([
  {
    path: '*',
    element: <Login />
  }
]);

const loggedRouter = createBrowserRouter([
  {
    path: '/',
    element: <Base />,
    children: [
      {
        ...BlogLocation,
        lazy: async () => { const { Blog } = await import('./views/Blog'); return { Component: Blog } },
      },
      {
        ...PostsLocation,
        element: <Posts />
      },
      {
        ...PostLocation,
        lazy: async () => { const { Post } = await import('./views/Post'); return { Component: Post } },
      },
      {
        ...MediaLocation,
        lazy: async () => { const { Media } = await import('./views/Media'); return { Component: Media } },
      },
      {
        path: 'post',
        lazy: async () => { const { Post } = await import('./views/Post'); return { Component: Post } },
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
