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
	},

	ReportsMenu: {
		listItems: [
			'reportCombined',
			'reportRoute',
			'reportEvents',
			'reportTrips',
			'reportStops',
			'reportSummary',
			'reportChart',
			'reportReplay'
		],

		_listItems: [
			'sharedLogs',
			'reportScheduled',
			'statisticsTitle'
		]
	},

	SettingsMenu: {
		listItems: [
			'sharedNotifications',
			'deviceTitle',
			'sharedGeofences',
			'settingsGroups',
			'settingsServer',
			'settingsUsers'
		],

		_listItems: [
			'sharedPreferences',
			'settingsUser',
			'sharedDrivers',
			'sharedCalendars',
			'sharedComputedAttributes',
			'sharedMaintenance',
			'sharedSavedCommands',
			'settingsSupport'
		]
	}
}

export default availableOptions;