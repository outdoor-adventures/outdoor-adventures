import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import FavoriteButton from '../../AddressSearch/FavoriteButton/FavoriteButton'
import './BasicModal.css'

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
  const [open, setOpen] = useState(false);
  const [adventureData, setAdventureData] = useState(null);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // Set adventure data when modal opens or adv changes
  useEffect(() => {
    if (typeof adv === 'object') {
      // If adv is already an object, use it directly
      setAdventureData(adv);
    } else if (adv && open) {
      // If adv is an ID and modal is open, fetch the data
      fetch(`/api/adventures/${adv}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAdventureData(data[0]);
          } else {
            setAdventureData(data);
          }
        })
        .catch(err => console.error('Error fetching adventure:', err));
    }
  }, [adv, open]);

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
          {adventureData ? (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '50px', marginTop: '-25px' }}>
                {adventureData.activity_name}
              </Typography>
              <Typography id="modal-modal-photo" sx={{ mt: 1 }}>
                <img 
                  src={`http://localhost:5001/uploads/${adventureData.photo}`}
                  alt={adventureData.activity_name || 'Adventure image'}
                  className='modal-adventure-image' 
                />
              </Typography>
              <Typography id="modal-modal-cost" variant="h6" component="h2">
                Cost: {adventureData.cost_level}
              </Typography>
              <Typography id="modal-modal-category" variant="h6" component="h2">
                Category: {adventureData.category_name}
              </Typography>
              <Typography id="modal-modal-ability" variant="h6" component="h2">
                Difficulty: {adventureData.ability_level}
              </Typography>
              <Typography id="modal-modal-address" variant="h6" component="h2">
                Location: {adventureData.address || `${adventureData.city || ''}, ${adventureData.state || ''} ${adventureData.zip || ''}`}
              </Typography>
              <Typography id="modal-modal-link" variant="h6" component="h2">
                Website: {adventureData.link}
              </Typography>
              <Typography id="modal-modal-description" variant="h6" component="h2">
                Description: {adventureData.description}
              </Typography>
            </>
          ) : (
            <Typography>Loading adventure details...</Typography>
          )}
          {/* <FavoriteButton adv={adv}/> */}
        </Box>
      </Modal>
    </div>
  );
}