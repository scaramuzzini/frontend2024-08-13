import axios from 'axios';
import { useEffect, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
const satIcon = new L.Icon({
    iconUrl: 'satellite.png',
    iconSize: [25,25]
});

function StarlinkList() {

    const [starlinks, setStarlinks] = useState([]);
    const [page,setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [textButton, setTextButton] = useState("Carregar mais");


    const fetchStarlinks = async (page) => {

        try {
            const response = await axios.post('https://api.spacexdata.com/v4/starlink/query', {
                "query": {},
                "options": { page: page, limit: 100 }
            });
            console.log(response.data);
            setStarlinks(response.data.docs);
		    setHasNextPage(response.data.hasNextPage);
        } catch (error) {
            console.log('Erro ao obter os dados...');
        }
    }

    const loadMore = () => {
        if (hasNextPage) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchStarlinks(nextPage);
        } else {
            setTextButton('Você chegou na última página');
        }
    };

    useEffect(() => {
        fetchStarlinks(page);
    }, []);


    return (
        <>
            <h4>Meu componente starlink</h4>
            
            <MapContainer center={[0,0]} zoom={2} style={{height: '80vh', width:'100%'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {starlinks
                    .filter((sat) => sat.latitude !== null && sat.longitude !== null)
                    .map((sat) => (
                        <Marker key={sat.id} position={[sat.latitude,sat.longitude]} icon={satIcon}> 
                            <Popup>
                                {sat.spaceTrack.OBJECT_NAME}    
                            </Popup>                            
                        </Marker>
                    )
                )
                }
                
            </MapContainer>

            <div style={{textAlign: 'center', margin:'20px 0'}}>
                <button onClick={loadMore}>
                    {textButton}
                </button>
            </div>
        </>
    );
}

export default StarlinkList;