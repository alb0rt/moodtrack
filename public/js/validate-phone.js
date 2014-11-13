function validatePhonenumber(input)
{
	var phone = /^(\+?1)?([0-9]{10})$/;
	if(input.value.match(phone)) {
		return true;
	} else
	{
		alert("Not a valid phone number");
		return false;
	}
}