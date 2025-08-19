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
  top: '50%',
  left: '50%',
  height: '90vh',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 2,
  display: 'flex',
  gap: 2,
};

const titleStyle = {
  fontWeight: 'bold', 
  fontSize: '32px', 
  marginBottom: '20px',
  textAlign: 'center'
};

const sectionStyle = {
  marginBottom: '15px',
  fontSize: '18px'
};

const imageContainerStyle = {
  width: '60%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const contentStyle = {
  width: '40%',
  padding: '20px',
  overflow: 'auto'
};

export default function BasicModal({ adv }) {
  const [open, setOpen] = useState(false);
  const [adventureData, setAdventureData] = useState(null);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const getImageUrl = (photo) => {
    if (!photo) return '/images/default-adventure.jpg';
    if (photo.startsWith('http')) return photo;
    return `http://localhost:5001/uploads/${photo}`;
  };
  
  
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
              <Box sx={imageContainerStyle}>
                <img 
                  src={getImageUrl(adventureData.photo)}
                  alt={adventureData.activity_name || 'Adventure image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
              
              <Box sx={contentStyle}>
                <Typography id="modal-modal-title" variant="h4" component="h2" sx={titleStyle}>
                  {adventureData.activity_name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  <Typography sx={sectionStyle} variant="body1">
                    <strong>Category:</strong> {adventureData.category_name}
                  </Typography>
                  <Typography sx={sectionStyle} variant="body1">
                    <strong>Difficulty:</strong> {adventureData.ability_level}
                  </Typography>
                  <Typography sx={sectionStyle} variant="body1">
                    <strong>Cost:</strong> {adventureData.cost_level}
                  </Typography>
                </Box>
                
                <Typography sx={sectionStyle} variant="body1">
                  <strong>Location:</strong> {adventureData.address || `${adventureData.city || ''}, ${adventureData.state || ''} ${adventureData.zip || ''}`}
                </Typography>
                
                <Typography sx={sectionStyle} variant="body1">
                  <strong>Description:</strong> {adventureData.description}
                </Typography>
                
                <Typography sx={sectionStyle} variant="body1">
                  <strong>Website:</strong> <a href={adventureData.link} target="_blank" rel="noopener noreferrer">{adventureData.link}</a>
                </Typography>
              </Box>
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