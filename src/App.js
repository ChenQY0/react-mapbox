import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import jsonData from "./times.json";

// import dayjs, { mockDataTime } from './dayjs';
// 引入子组件
// import Children from './components/slider';
 
mapboxgl.accessToken = '';
 
export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const datatime = useRef();
  const [lng, setLng] = useState(116.3883);
  const [lat, setLat] = useState(39.9289);
  const [zoom, setZoom] = useState(3);
 
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        "version": 8,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                "tiles": ["https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"],
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
      // maxZoom: 5.99,
      // minZoom: 4,
      center: [lng, lat],
      zoom: zoom,
    });
    let currentOffset = 0;
    let previousOffset = currentOffset;
    function getTileServer(stepNumber, layers,opacity = 0) {
      const url = ``;
      map.current.addSource(layers,{
        'type': 'raster',
        'tiles': [ url ],
        'tileSize': 256
      });
      map.current.addLayer({
        "id": layers,
        "type": "raster",
        "source": layers,
        "paint": {
          'raster-opacity': opacity,
          "raster-fade-duration": 0
        }
      });
      return map.current.getSource(layers)
    }
    map.current.on('load', function(){
      const frames = [];
      for (let i = 0; i < jsonData.length; i+= 1) {
        const opacity = (i === 0 ) ? 1 : 0;
        frames.push(getTileServer(i, 'radar-global'+i,opacity));
      }
      const waitTime = 500;
      const stepTime = 400;
      setTimeout(() => {
        setInterval(() => {
          previousOffset = currentOffset;
          currentOffset += 1;
          if (currentOffset === jsonData.length - 1) {
            currentOffset = 0;
          }
          map.current.setPaintProperty(frames[previousOffset].id,'raster-opacity', 0)
          map.current.setPaintProperty(frames[currentOffset].id,'raster-opacity', 1)
        }, stepTime)
      }, waitTime)
    })
  });
  
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(parseInt(map.current.getZoom()));
    });
    if(datatime.current){
      clearInterval( datatime.current);
    }

  });
 
  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      {/* <Children /> */}
    </div>
  );

}