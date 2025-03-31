/**
 * @module LeafletMap
 * @description Handles the creation and management of an interactive Leaflet map 
 * displaying global COVID-19 statistics with search functionality.
 * @requires leaflet
 * @requires leaflet/dist/leaflet.css
 * @see {@link https://leafletjs.com/|LeafletJS}
 * @see {@link https://disease.sh/docs/|Disease.sh API}
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Main function to initialize the COVID-19 map visualization
 * @alias module:LeafletMap.initMap
 * @example
 * // Initialize the map
 * initMap();
 * 
 * // With custom container ID
 * document.getElementById('customMap').id = 'mapContainer';
 * initMap();
 */
export function initMap() {
    /**
     * @private
     * @description Checks DOM readiness and initializes map components
     */
    function checkDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

    /**
     * @private
     * @description Core initialization function
     * @throws {Error} When map container is not found
     */
    function initialize() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) throw new Error('Map container not found');

        fixLeafletIcons();
        const map = initBaseMap(mapContainer);
        loadCovidData(map).catch(handleDataError);
        setupSearch(map);
    }

    /**
     * @private
     * @description Fixes Leaflet's default icon paths
     */
    function fixLeafletIcons() {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
        });
    }

    /**
     * @private
     * @description Initializes base map configuration
     * @param {HTMLElement} container - The DOM element to contain the map
     * @returns {L.Map} Configured Leaflet map instance
     */
    function initBaseMap(container) {
        const map = L.map(container).setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return map;
    }

    /**
     * @private
     * @description Fetches and displays COVID-19 data
     * @param {L.Map} map - Leaflet map instance
     * @returns {Promise<void>}
     * @throws {Error} When data fetching fails
     */
    async function loadCovidData(map) {
        try {
            const response = await fetch('https://disease.sh/v3/covid-19/countries');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            data.forEach(country => createCountryMarker(map, country));
        } catch (error) {
            throw new Error(`Failed to load COVID data: ${error.message}`);
        }
    }

    /**
     * @private
     * @description Creates a marker for a country with COVID data
     * @param {L.Map} map - Leaflet map instance
     * @param {Object} country - Country data object
     * @param {Object} country.countryInfo - Geographic information
     * @param {number} country.countryInfo.lat - Latitude
     * @param {number} country.countryInfo.long - Longitude
     * @param {string} country.country - Country name
     * @param {number} country.cases - Total cases
     * @param {number} country.deaths - Total deaths
     * @param {number} country.recovered - Total recovered
     */
    function createCountryMarker(map, country) {
        if (!country.countryInfo?.lat || !country.countryInfo?.long) return;

        const marker = L.marker([country.countryInfo.lat, country.countryInfo.long]).addTo(map);
        marker.bindPopup(`
            <b>${country.country}</b><br>
            Cases: ${country.cases.toLocaleString()}<br>
            Deaths: ${country.deaths.toLocaleString()}<br>
            Recovered: ${country.recovered.toLocaleString()}
        `);
    }

    /**
     * @private
     * @description Handles data loading errors
     * @param {Error} error - The error object
     */
    function handleDataError(error) {
        console.error('Data loading error:', error);
        // Consider adding user-facing error notification here
    }

    /**
     * @private
     * @description Sets up search functionality
     * @param {L.Map} map - Leaflet map instance
     */
    function setupSearch(map) {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (!searchInput || !searchButton) {
            console.warn('Search elements not found');
            return;
        }

        searchButton.addEventListener('click', () => performSearch(map, searchInput));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(map, searchInput);
        });
    }

    /**
     * @private
     * @description Executes map search
     * @param {L.Map} map - Leaflet map instance
     * @param {HTMLInputElement} input - Search input element
     */
    function performSearch(map, input) {
        const query = input.value.trim().toLowerCase();
        if (!query) return;
        console.log('Search executed for:', query);
        // Actual search implementation would go here
    }

    // Start the initialization
    checkDOM();
}