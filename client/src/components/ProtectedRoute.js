import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {useAuthContext} from '../utils/GlobalState'


const ProtectedRoute =({ component: Component, ...rest}) => {
  const[auth,] = useAuthContext(null)

  return (
    <Route {...rest} render={
      props => {
        if (auth) {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/SignIn',
              state: {
                from: props.location
              }
            }
          } />
        }
      }
    } />
  )
}
    
export default ProtectedRoute;