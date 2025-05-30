import React from 'react'
import "./BrowseAdventures.css";
import AddressSearch from '../AddressSearch/AddressSearch';
import Footer from '../Footer/Footer';

export default function BrowseAdventuresPage() {
  return (
    <>

    {/* <div className='browse-adventures-title'>BrowseAdventuresPage</div> */}
    <div className='browse-adventures-page'>



    <div className='search-container'>
      Search / Filters Container
    </div>
    


    <div className='map-list-container'>


        <div className='map-container'>
          <AddressSearch />
        </div>

        <div className='adventure-list-container'>
          Adventure List Container
        </div>

    </div>





    </div>

    </>

  )
}