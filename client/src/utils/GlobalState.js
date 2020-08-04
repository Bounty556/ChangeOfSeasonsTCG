import React, { createContext, useContext, useState} from 'react';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = (props) => {
    const [auth, setAuth] = useState(null);

    return <Provider value={[auth, setAuth]}>{props.children}</Provider>
};

const useAuthContext =() => {
    return useContext(AuthContext);
};

export {AuthProvider, useAuthContext};