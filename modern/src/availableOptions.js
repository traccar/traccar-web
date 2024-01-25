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
	},

	NotificationPage: {
		types: [
			{ type: 'deviceOnline' },
			{ type: 'deviceUnknown' },
			{ type: 'deviceOffline' },
			{ type: 'deviceInactive' },
			{ type: 'deviceMoving' },
			{ type: 'deviceStopped' },
			{ type: 'geofenceEnter' },
			{ type: 'geofenceExit' }
		],

		_types: [
			{ type: 'commandResult' },		
			{ type: 'queuedCommandSent' },		
			{ type: 'deviceOverspeed' },
			{ type: 'deviceFuelDrop' },
			{ type: 'deviceFuelIncrease' },
			{ type: 'alarm' },
			{ type: 'ignitionOn' },
			{ type: 'ignitionOff' },
			{ type: 'maintenance' },
			{ type: 'textMessage' },
			{ type: 'driverChanged' },
			{ type: 'media' }
		],

		showExtra: false
	}
}

export default availableOptions;