// import Home from './HomePage/Home/Home'
import React from 'react';
import './CSS/App.css';
// import ViewPost from './ViewPost/ViewPost'
import { Switch, Route, withRouter } from 'react-router-dom'
import store from './Redux/store';
import { Provider } from 'react-redux';
import Login from './LoginForm/Login';
import SignUp from './SignUpForm/SignUp';
import Home from './HomePage/Home/index';
import ViewPost from './ViewPost/index';
// import { validateUserToken } from './Redux/actions';

class App extends React.Component {



  render() {
    // const token = localStorage.getItem('token')
    return (
      <Provider store={store}>
        <header className="App-header" >
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/signUp' component={SignUp} />
            <Route exact path='/home' component={Home} />
            <Route path='/viewPost/:id' component={ViewPost} />

          </Switch>
        </header >
      </Provider>
    );
  }
}



export default App;
