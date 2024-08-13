import axios from 'axios';
import { useEffect, useState } from 'react';

function StarlinkList() {

    const [starlinks, setStarlinks] = useState([]);

    const fetchStartlinks = async () => {
        const response = await axios.post('https://api.spacexdata.com/v4/starlink/query', {
            "query": {},
            "options": { limit: 10 }
        });
        console.log(response.data);
        setStarlinks(response.data.docs);
    }

    useEffect(() => {
        fetchStartlinks();
    }, []);


    return (
        <>
            <h4>Meu componente starlink</h4>
            <ul>
                {starlinks.map((sat) => (
                        <li key={sat.id}> {sat.spaceTrack.OBJECT_NAME}</li>
                    )
                )
                }
            </ul>
        </>
    );
}

export default StarlinkList;