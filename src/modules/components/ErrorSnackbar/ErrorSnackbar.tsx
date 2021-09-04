import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { AppRootState } from '../../state/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { appSetErrorAC } from '../../state/app-reducer';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ErrorSnackbar() {
  const dispatch = useDispatch();
  const error = useSelector<AppRootState, null | string>(state => state.app.error);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(appSetErrorAC(null));
  };

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  );
}
