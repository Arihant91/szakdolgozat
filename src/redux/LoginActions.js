export const changeLogin = loginState => (
    {
        type: 'LOGGED_IN',
        payload: loginState,
    }
);

export const changeLogout = loginState => (
    {
        type: 'LOGGED_OUT',
        payload: loginState,
    }
);