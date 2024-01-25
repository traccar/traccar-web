const availableOptions ={
	RouteReportPage: {
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
		],

		columnsArray: [
			['eventTime', 'positionFixTime'],
			['type', 'sharedType'],
			['geofenceId', 'sharedGeofence']
		]
	},

	TripReportPage: {
		columnsArray: [
			['startTime', 'reportStartTime'],
			['startAddress', 'reportStartAddress'],
			['endTime', 'reportEndTime'],
			['endAddress', 'reportEndAddress'],
			['distance', 'sharedDistance'],
			['averageSpeed', 'reportAverageSpeed'],
			['maxSpeed', 'reportMaximumSpeed'],
			['duration', 'reportDuration']
		]
	},

	StopReportPage: {
		columnsArray: [
			['startTime', 'reportStartTime'],
			['endTime', 'reportEndTime'],
			['address', 'positionAddress'],
			['duration', 'reportDuration']
		]
	},

	SummaryReportPage: {
		columnsArray: [
			['startTime', 'reportStartDate'],
			['distance', 'sharedDistance'],
			['averageSpeed', 'reportAverageSpeed'],
			['maxSpeed', 'reportMaximumSpeed']
		]
	},

	ChartReportPage: {
		types: [
			'latitude',
			'longitude',
			'speed',
			'accuracy',
			'batteryLevel',
			'distance',
			'totalDistance'
		]
	}
}

export default availableOptions;