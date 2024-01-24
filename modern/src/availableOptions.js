const availableOptions ={
	RouteReportsPage: {
		columns: [
			['latitude', 'Latitude'],
			['longitude', 'Longitude'],
			['speed', 'Speed'],
			['address', 'Address'],
			['deviceTime', 'Device Time'],
			['fixTime', 'Fix Time'],
			['serverTime', 'Server Time'],
			['geofenceIds', 'Geo Fences'],
			['batteryLevel', 'Battery Level'],
			['charge', 'Charge'],
			['distance', 'Distance'],
			['totalDistance', 'Total Distance'],
			['motion', 'Motion']
		]
	},

	EventReportPage: {
		allEventTypes: [
			['allEvents', 'eventAll'],
			['deviceOnline', 'eventDeviceOnline'],
			['deviceUnknown', 'eventDeviceUnknown'],
			['deviceOffline', 'eventDeviceOffline'],
			['deviceInactive', 'eventDeviceInactive'],
			['deviceMoving', 'eventDeviceMoving'],
			['deviceStopped', 'eventDeviceStopped'],
			['geofenceEnter', 'eventGeofenceEnter'],
			['geofenceExit', 'eventGeofenceExit']
		]
	}
}

export default availableOptions;