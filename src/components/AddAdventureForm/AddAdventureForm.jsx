import { useState } from 'react';
import useStore from '../../zustand/store';


const AddAdventureForm= () => {
    const [photo, setPhoto] = useState(null);
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [location, setLocation] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');

    const submitAdventure = useStore((state) => state.submitAdventure);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAdventure({
      photo,
      price,
      category,
      difficulty,
      location,
      link,
      description,
    });
};
return (
    <form onSubmit={handleSubmit}>
      {/* Photo Uploader */}
      <div>
        <label htmlFor="photo">Photo:</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        </div>

        {/* Adventure Details */}
        <div>
            <label htmlFor="photo">Price:</label>
          

                <label htmlFor="category">Category:</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>

                </select>

        </div>
        </form>