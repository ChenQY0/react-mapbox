import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 
mapboxgl.accessToken = '';
 
export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(116.3883);
  const [lat, setLat] = useState(39.9289);
  const [zoom, setZoom] = useState(9);
 
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        "version": 8,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                "tiles": ["http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"],
                "tileSize": 256
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "raster-tiles",
            "minzoom": 0,
            "maxzoom": 20
        }]
      },
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on('load', function() {
      map.current.addLayer({
        'id': 'wms-test-layer',
        'type': 'raster',
        'source': {
        'type': 'raster',
        'tiles': [
          'https://cdn-w.caiyunapp.com/p/mason/dev/20220803T033500Z/20220803T054000Z/radar/{z}/{y}/{x}/{z}_{y}_{x}.png'
        ],
        'tileSize': 256
        },
        'paint': {}
        });
    })

  });
  
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(parseInt(map.current.getZoom()));
    });
  });
 
  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}