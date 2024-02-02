'user strict';

const formContainer = document.querySelector('#form-container');
const form = document.querySelector('#countdownForm');
const dateInput = document.querySelector('#date-picker');

const countDown = document.querySelector('#countdown');
const countdownTitle = countDown.querySelector('#countdown-title');
const timeElements = countDown.querySelectorAll('span');
const resetBtn = countDown.querySelector('#reset-btn');

const complete = document.querySelector('#complete');
const completeInfo = complete.querySelector('#complete-info');
const completeBtn = complete.querySelector('#complete-btn');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const countdownState = {
	active: '',
	distance: 0,
};

// set date input min with today's date
function setDateInputMin() {
	const today = new Date().toISOString().split('T')[0];
	dateInput.setAttribute('min', today);
}

// populate the countdown
function setCountdownTimes(countdownTime) {
	const now = new Date().getTime();
	countdownState.distance = countdownTime - now;

	const days = Math.floor(countdownState.distance / day);
	const hours = Math.floor((countdownState.distance % day) / hour);
	const minutes = Math.floor((countdownState.distance % hour) / minute);
	const seconds = Math.floor((countdownState.distance % minute) / second);

	const time = [days, hours, minutes, seconds];

	// add the calculated time into span elements
	timeElements.forEach((element, index) => (element.textContent = time[index]));

	return countdownState.distance <= 0; //returns true if countdown has reached zero
}

function displayCountdown(countdownTime, title) {
	setCountdownTimes(countdownTime);
	countdownState.active = setInterval(() => setCountdownTimes(countdownTime), second);
	countdownTitle.textContent = title;

	formContainer.hidden = true;
	complete.hidden = true;
	countDown.hidden = false;
}

function completeCountdown() {
	clearInterval(countdownState.active);

	completeInfo.textContent = `${form.title.value} finished on ${form.date.value}`;

	formContainer.hidden = true;
	countDown.hidden = true;
	complete.hidden = false;
}

function resetCountdown() {
	clearInterval(countdownState.active);
	localStorage.removeItem('countdown');

	form.title.value = '';
	form.date.value = '';
	countdownTitle.textContent = '';
	timeElements.forEach((element) => (element.textContent = '0'));

	complete.hidden = true;
	countDown.hidden = true;
	formContainer.hidden = false;
}

function updateDOM(date, title) {
	// get number of the version of current Date
	const countdownTime = new Date(date).getTime();

	// show the countdown or display complete UI if the countdown has ended
	const countdownCompleted = setCountdownTimes(countdownTime);
	countdownCompleted ? completeCountdown() : displayCountdown(countdownTime, title);
}

function handleSubmit(e) {
	e.preventDefault();

	const formDate = {
		title: form.title.value.trim(),
		date: form.date.value,
	};

	// check for valid date
	if (formDate.date === '') return alert('Please select a date for the countdown');

	// update DOM
	updateDOM(formDate.date, formDate.title);

	// save the countdown date in the localStroage
	localStorage.setItem('countdown', JSON.stringify(formDate));
}

function restorePreviousCountdown() {
	const savedCountdown = JSON.parse(localStorage.getItem('countdown'));
	if (localStorage.countdown) updateDOM(savedCountdown.date, savedCountdown.title);
}

form.addEventListener('submit', handleSubmit);
resetBtn.addEventListener('click', resetCountdown);
completeBtn.addEventListener('click', resetCountdown);

setDateInputMin();
restorePreviousCountdown();
