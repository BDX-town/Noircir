import React from 'react';
import { AppContextProvider, useAppContext } from './data/AppContext';
import { ErrorBoundary } from './data/ErrorBoundary';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Base } from './layout/Base';
import { TranslationContext } from '@bdxtown/canaille';
import '@mdxeditor/editor/style.css';
// import '@bdxtown/canaille/src/scss/google-fonts.scss';
import translate from 'counterpart';


import { Posts } from './views/Posts';
import { ErrorElement } from './bits/ErrorElement';
import { BlogLocation, PostsLocation, PostLocation, MediaLocation, SettingsLocation, InviteLocation } from './views/Locations';
import { Loader as BaseLoader } from './bits/Loader';


const Login = React.lazy(() => import('./views/Login'));
const Invite = React.lazy(() => import('./views/Invite'));
const Media = React.lazy(() => import('./views/Media'));
const Post = React.lazy(() => import('./views/Post'));
const Blog = React.lazy(() => import('./views/Blog'));
const Settings = React.lazy(() => import('./views/Settings'));

const Loader = ({ children }: { children: React.ReactNode }) => <React.Suspense fallback={<div className='grow flex items-center justify-center p-4'><BaseLoader /></div>}>{ children }</React.Suspense>


const baseRouter = createBrowserRouter([
  { 
    path: InviteLocation.path + '/' + InviteLocation.param,
    element: <Loader><Invite /></Loader>
  },
  {
    path: '*',
    element: <Loader><Login /></Loader>
  }
]);

const loggedRouter = createBrowserRouter([
  {
    path: PostsLocation.path,
    element: <Base write />,
    children: [
      {
        ...PostsLocation,
        index: true,
        element: <Posts />,
        errorElement: <ErrorElement />
      },
    ]
  },
  {
    path: '/',
    element: <Base />,
    children: [
      {

        path: PostLocation.path + "/:file",
        element: <Loader><Post /></Loader>,
        errorElement: <ErrorElement />
      },
      {
        ...PostLocation,
        element: <Post blank />,
        errorElement: <ErrorElement />
      },
      {
        ...BlogLocation,
        element: <Loader><Blog /></Loader>,
        errorElement: <ErrorElement />
      },
      {
        ...MediaLocation,
        element: <Loader><Media /></Loader>,
        errorElement: <ErrorElement />
      },
      {
        ...SettingsLocation,
        element: <Loader><Settings/></Loader>,
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
