import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Routes.jsx';
import theme from './theme.js';
import AuthProvider from './providers/AuthProvider.jsx';
import baseUrl from './baseUrl.js';
import SnackProvider from './providers/SnackProvider.jsx';

const httpLink = createHttpLink({ // to instruct apollo to send cookies
  uri: `${baseUrl}/graphql`,
  credentials: 'include', // since my client and server is at different location
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token-UuSs');
  const tokenId = localStorage.getItem('tokenId-UuSs');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      token_ca: token ? token : "",
      token_id_ca: tokenId ? tokenId : "",
    }
  }
});

const client = new ApolloClient({
  // uri: 'http://localhost:4000/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackProvider>
            <RouterProvider router={router} />
          </SnackProvider>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
