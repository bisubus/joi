let momentStub = {
	isValid: () => false
};

module.exports = function momentFn() {
	if (typeof moment !== 'function')
		return momentStub;

	if (Object.keys(momentFn).length === 0) {
		var keys = Object.keys(moment);

		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			momentFn[key] = moment[key];
		}
	}
	
	return moment.apply(null, arguments);
}