export const fetchCoordinates = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      // Seleccionamos el primer resultado
      return {
        lat: data[0].lat,
        lon: data[0].lon
      };
    } else {
      alert("No se encontraron resultados para la dirección proporcionada.");
      return null;
    }
  } catch (error) {
    console.error("Error al buscar coordenadas:", error);
    alert("Hubo un error al buscar las coordenadas.");
    return null;
  }
};