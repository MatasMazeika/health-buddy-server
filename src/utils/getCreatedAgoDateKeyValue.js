export const getCreatedAgoTimeValue = ({
	months, days, hours, minutes, seconds, years,
}) => {
	if (!minutes) {
		return { seconds };
	}
	if (!hours && minutes) {
		return { minutes };
	}
	if (!days && hours && minutes) {
		return { hours };
	}

	return {
		years, months, days,
	};
};
