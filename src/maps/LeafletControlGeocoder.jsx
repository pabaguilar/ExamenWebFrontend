import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

function LeafletControlGeocoder({setCoordinates = null}) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {

    const handleMapClick = (event) => {
      console.log(event.latlng)

      const icon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      })

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      
      markerRef.current = L.marker(event.latlng, { icon })
        .addTo(map)
        .bindPopup(event.latlng.toString())
        .openPopup();

      if (typeof setCoordinates === 'function') {
        setCoordinates({
          lat: event.latlng.lat,
          lon: event.latlng.lng,
        });
      }
    };
    

    const geocoder = L.Control.Geocoder.nominatim();

    const control = L.Control.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder,
    })
    .on("markgeocode", function (e) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      const latlng = e.geocode.center;
      const icon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', 
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Añadir un marcador en la ubicación seleccionada
      markerRef.current = L.marker(latlng, { icon })
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();

      if (typeof setCoordinates === 'function') {
        setCoordinates({
          lat: latlng.lat,
          lon: latlng.lng,
        });
      }

      // Cambiar la vista del mapa para centrar la búsqueda
      map.setView(latlng, map.getZoom(), { animate: true });
    })
    .addTo(map);

    map.on("click", handleMapClick)

    // Limpiar el control cuando el componente se desmonte
    return () => {
      control.remove();
      map.off("click", handleMapClick);
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
    };
  }, [map]);

  return null;
}

export default LeafletControlGeocoder;
