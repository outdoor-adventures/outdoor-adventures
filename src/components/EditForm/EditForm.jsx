import { useState } from 'react';

function EditForm() {

    //useState hooks
    const [title, setTitle] = useState('');
    const [image, setImage ] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [location, setLocation] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');

    //PRICE, CATEGORY, DIFFICULTY need to be using a dropdown. this is just a sample.
    
    //i wasnt sure if i was supposed to code or anything so i threw this in here but feel free to delete it
    return (
      <>
        <h2>Edit</h2>
        <p>This is the edit form / modal</p>
        <p>sample form inputs below</p>


    {/* <form onSubmit={FUNCTION-HERE}>
        <input
        type="text"
        id="adventure-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
            />
        <input
        type="file"
        id="image-select"
        value={image}
        onChange={(e) => setImage(e.target.value)}
            />
         <input
        type=""
        id="price-dropdown"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
            /> 
        <input
        type=""
        id="category-dropdown"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
            />
        <input
        type=""
        id="difficulty-dropdown"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
            />
        <input
        type="text"
        id="location-input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
            />
        <input
        type="text"
        id="link-input"
        value={link}
        onChange={(e) => setLink(e.target.value)}
            />
        <input
        type="text"
        id="description-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
            />
            <button type='submit'>
                Submit
            </button>
    </form> */}
        
      </>
    );
  }
  
  
  export default EditForm;
  