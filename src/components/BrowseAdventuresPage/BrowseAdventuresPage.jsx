import React from 'react'
import "./BrowseAdventures.css";
import AddressSearch from '../AddressSearch/AddressSearch';

export default function BrowseAdventuresPage() {
  return (
    <>
    {/* <div className='browse-adventures-title'>BrowseAdventuresPage</div> */}
    <div className='browse-adventures-page'>

    <body>

    <div className='search-container'>
      Search / Filters Container

      <div className='search-bar' input type="text" placeholder="Search.." name="search">
      </div>
    </div>

    <div className='map-list-container'>
      <AddressSearch />

        <div className='map-container'>
          Map Container
        </div>

        <div className='adventure-list-container'>
          Adventure List Container
        </div>

    </div>

    <div className='footer'>
      Footer
    </div>

    </body>

    </div>
    </>

  )
}