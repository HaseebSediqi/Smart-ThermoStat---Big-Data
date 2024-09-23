// client/scripts.js

document.getElementById('search-flights').addEventListener('click', searchFlights);

function searchFlights() {
    const fromAirport = document.getElementById('from-airport').value;
    const toAirport = document.getElementById('to-airport').value;
    const travelDate = document.getElementById('travel-date').value;

    fetch(`/api/flights?from=${fromAirport}&to=${toAirport}&date=${travelDate}`)
        .then(response => response.json())
        .then(data => displayFlights(data))
        .catch(error => console.error('Error fetching flights:', error));
}

function displayFlights(flights) {
    const flightList = document.getElementById('flight-list');
    flightList.innerHTML = '<h2>Available Flights</h2><ul>' +
        flights.map(flight => `
            <li>
                ${flight.airline} - ${flight.flightNumber}<br>
                Departure: ${flight.departureTime}<br>
                Arrival: ${flight.arrivalTime}<br>
                Price: $${flight.price.toFixed(2)}
                <button onclick="selectFlight(${flight.id})">Select</button>
            </li>
        `).join('') +
        '</ul>';
}

function selectFlight(flightId) {
    fetch(`/api/flight/${flightId}`)
        .then(response => response.json())
        .then(flight => {
            document.getElementById('ticket-form').style.display = 'block';
            document.getElementById('ticket-form').onsubmit = (e) => {
                e.preventDefault();
                generateTicket(flight);
            };
        })
        .catch(error => console.error('Error selecting flight:', error));
}

function generateTicket(flight) {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;

    fetch('/api/generate-ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flight, user: { name, surname, email } })
    })
        .then(response => response.json())
        .then(data => alert('Ticket generated and sent to your email!'))
        .catch(error => console.error('Error generating ticket:', error));
}
