const map = {
	ą: 'a',
	č: 'c',
	ę: 'e',
	ė: 'e',
	į: 'i',
	š: 's',
	ų: 'u',
	ū: 'u',
	ž: 'z',
};

export const mapLithuanianChars = (string) => {
	const newString = [];

	for (let i = 0; i < string.length; i += 1) newString[i] = map[string[i]] || string[i];

	return newString.join('');
};
