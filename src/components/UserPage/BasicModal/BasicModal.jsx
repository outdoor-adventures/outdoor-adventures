import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import FavoriteButton from '../../AddressSearch/FavoriteButton/FavoriteButton'
import './BasicModal.css'
import { height } from '@mui/system';

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1220,
  height: 1100,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ adv }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>View Details</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '50px', marginTop: '-25px' }}>
            Minnehaha Falls Hike
          </Typography>
          <Typography id="modal-modal-photo" sx={{ mt: 1 }}>
          <img src={`/uploads/1748934605425.jpg`}
                      alt={adv.photo}
                      className='adventure-image' />
          </Typography>
          <Typography id="modal-modal-cost" variant="h6" component="h2">
            Free
          </Typography>
          <Typography id="modal-modal-category" variant="h6" component="h2">
            Hiking & Nature Walk
          </Typography>
          <Typography id="modal-modal-ability" variant="h6" component="h2">
            Very Easy
          </Typography>
          <Typography id="modal-modal-address" variant="h6" component="h2">
            Minneapolis, MN, USA
          </Typography>
          <Typography id="modal-modal-link" variant="h6" component="h2">
          https://www.minneapolisparks.org/parks__destinations/parks__lakes/minnehaha_regional_park/

          </Typography>
          <Typography id="modal-modal-description" variant="h6" component="h2">
          Scenic hike with a waterfall. Great for beginners.
          </Typography>
         {/* <FavoriteButton adv={adv}/> */}
        </Box>
      </Modal>
    </div>
  );
}