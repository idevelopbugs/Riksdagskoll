import React, { Component } from 'react';
import {Grid} from 'react-bootstrap';
import Main from './components/Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid>
          <Main />
        </Grid>
      </div>
    );
  }
}

export default App;
