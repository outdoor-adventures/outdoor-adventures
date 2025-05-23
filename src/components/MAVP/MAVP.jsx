import { useState, useRef, useEffect } from "react";

function MAVP() {

    const [modaltoggled, setModaltoggled] = useState(false)
    const modalRef = useRef(null)

    function handleModalToggleClick(e) {
        setModaltoggled(!modaltoggled)
    }
    
    useEffect(() => {
        function handler (e) {
            //
        }

        window.addEventListener('click', handler)
    }, [])

        return (
            <div className="MAVP">
                <button>Toggle the modal</button>
                {modaltoggled && (
                    <div className="modal" ref={modalRef}>
                        <h1>MODAL</h1>
                        <button onClick={handleModalToggleClick}>Close</button>
                    </div>
                )}
            </div>
        );
}

export default MAVP;