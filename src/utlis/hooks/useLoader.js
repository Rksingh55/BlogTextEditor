import { Box, CircularProgress } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const openLoader = (msg) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const closeLoader = () => {
    setMessage('');
    setIsLoading(false);
  };

  const Loader = () => {
    if (!isLoading) return null;

    return (
      <Modal open={true} onClose={() => {}}>
        <Box sx={style}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 22 }}>
              <CircularProgress />
            </div>
            <p>{message}</p>
          </div>
        </Box>
      </Modal>
    );
  };

  return [openLoader, closeLoader, Loader];
};
