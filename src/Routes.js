import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import Main from './pages/Main';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

function Routes() {
  return (
    <Router>
      <Switch>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Route exact path="/" component={Main} />
          </ThemeProvider>
        </RecoilRoot>
      </Switch>
    </Router>
  );
}

export default Routes;
