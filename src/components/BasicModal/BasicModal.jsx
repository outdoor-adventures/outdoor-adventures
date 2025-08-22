import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FavoriteButton from '../AddressSearch/FavoriteButton/FavoriteButton';
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
  '@media (max-width: 1500px)': {
    flexDirection: 'column',
    height: '90vh',
    maxHeight: '90vh',
    width: '95%'
  }
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
  alignItems: 'center',
  '@media (max-width: 1500px)': {
    width: '100%',
    height: '550px'
  }
};

const contentStyle = {
  width: '40%',
  padding: '20px',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 1500px)': {
    width: '100%',
    padding: '10px 20px'
  }
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
          <Button 
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              minWidth: '30px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.1)',
              color: '#000',
              fontSize: '18px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)'
              }
            }}
          >
            ×
          </Button>
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

                <Typography sx={{
                  ...sectionStyle, 
                  marginBottom: '25px', 
                  '@media (max-width: 1200px)': { 
                    marginBottom: '15px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical'
                  }
                }} variant="body1">
                   {adventureData.description}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  flexWrap: 'wrap',
                  gap: 2, 
                  marginBottom: '20px', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 'auto',
                  marginBottom: '5px',
                  '@media (max-width: 600px)': {
                    flexDirection: 'column',
                    gap: 0.5
                  }
                }}>
                
                </Box>

                  <Box sx={{ 
                  marginTop: 'auto',
                  marginBottom: '10px',
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f8f8f8',
                  width: '%',
                  boxSizing: 'border-box',
                  '@media (max-width: 1500px)': {
                    position: 'absolute',
                    bottom: '100px',
                    left: '20px',
                    right: '20px',
                    marginTop: 0,
                    marginBottom: 0
                  }
                }} className="location-website">
                  <Typography sx={sectionStyle} variant="body1" >
                    <strong>Location:</strong> {adventureData.address || `${adventureData.city || ''}, ${adventureData.state || ''} ${adventureData.zip || ''}`}
                  </Typography>
                  
                  <Typography sx={{...sectionStyle, maxWidth: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 1, marginBottom: 0}} variant="body1">
                    <strong>Website:</strong>
                    <a 
                      href={adventureData.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        marginBottom: 0
                      }}
                    >
                      {adventureData.link}
                    </a>
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: 2, 
                  paddingTop: '5%',
                  marginBottom: '0.1vw',
                  borderTop: '1px solid #e0e0e0',
                  '@media (max-width: 1500px)': {
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    marginTop: 0,
                    marginBottom: 0,
                    borderTop: 'none',
                    paddingTop: 0
                  }
                }}>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      CATEGORY
                    </Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {adventureData.category_name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      DIFFICULTY
                    </Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {adventureData.ability_level}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      COST
                    </Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {adventureData.cost_level}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      FAVORITE ADVENTURE
                    </Typography>
                    <FavoriteButton adventureId={adventureData.id} />
                  </Box>
                </Box>
                
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