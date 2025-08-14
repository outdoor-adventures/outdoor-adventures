import React from 'react';
import useStore from '../../zustand/store'

const NewsletterSignUp = () => {
    const user = useStore((store) => store.user);
    return <div>
        NewsletterSignUp
        </div>;
};

export default NewsletterSignUp;
