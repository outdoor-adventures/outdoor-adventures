import React from 'react'
import "./BrowseAdventures.css";
import AddressSearch from '../AddressSearch/AddressSearch';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import AdventuresList from './AdventuresList/AdventuresList';

export default function BrowseAdventuresPage() {

  
  return (
    <>
          <Nav pageTitle="Browse Adventures" />

    {/* <div className='browse-adventures-title'>BrowseAdventuresPage</div> */}
    <div className='browse-adventures-page'>


    <div className='search-container'>
      Search / Filters Container
    </div>
    


    <div className='map-list-container'>
      <AddressSearch />
    </div>





    </div>

    </>

  )
}