import React from 'react'
import "./BrowseAdventures.css";
import AddressSearch from '../AddressSearch/AddressSearch';
import Nav from '../Nav/Nav';

export default function BrowseAdventuresPage() {

  
  return (
    <>

    <Nav pageTitle="Browse Adventures" />

    
    
    <div className='browse-adventures-page'>
          <AddressSearch />
    </div>






    </>

  )
}