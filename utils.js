var weekendDays = [0, 6];
var holidays = [[1,1],[5,28],[9,1],[11,27],[11,28],[12,24],[12,25]];
var PST_OFFSET = -420;

exports.isVacation = function() {
	var today = new Date();
	// since Heroku system time is GMT, add PST offset to check the date in for PST
	today.setMinutes(today.getMinutes() + PST_OFFSET);
	var bool = false;

	if(weekendDays.indexOf(today.getDay()) >= 0) {
		bool = true;
	}

	for (day in holidays) {
		if(holidays[day][0] == today.getMonth()+1 && holidays[day][1] == today.getDate()) {
			bool = true;
		}
	}

	return bool;
};
