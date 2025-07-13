const form = document.getElementById('form');
const name_input = document.getElementById('fullname');
const email_input = document.getElementById('email');
const phone_input = document.getElementById('phone');
const state_input = document.getElementById('state');
const subjects_input = document.getElementById('subjects');
const address_input = document.getElementById('address');
let selected_state;
let selected_subject;


const db = firebase.database().ref('scribes');

state_input.addEventListener('change', () => {
    selected_state = state_input.value;
});
subjects_input.addEventListener('change', () => {
    selected_subject = subjects_input.value;
});

form.addEventListener('submit', (e) => {
e.preventDefault();
let name = name_input.value;
let email = email_input.value;
let number = phone_input.value;
let state = selected_state;
let subject = selected_subject;
let address = address_input.value;

if(validate_inputs(name, email, number, state, subject, address)) {
submit_data(name, email, number, state, subject, address);
alert('your data has been submited! you will be contacted when any visually impaired student select you as scribe.');
}
else{
    alert('Please fill in all fields correctly.');
}
});

// function to validating inputs
function validate_inputs(name, email, number, state, subject, address) {
return name.trim() && email.trim() && number.trim() && state.trim() && subject.trim() && address.trim();
}

// function to save data in database
function submit_data(scribe_name, scribe_email, scribe_phone, scribe_state, scribe_subject, scribe_address) {
const newScribeRef = db.push();
            const serialNumber = newScribeRef.key;
newScribeRef.set({
serialNumber: serialNumber,
full_name: scribe_name,
email_id: scribe_email,
phone_number: scribe_phone,
State: scribe_state,
Subject: scribe_subject,
Address: scribe_address
}).then(() => {
console.log('scribe submited data successfully!');
form.reset();
});
}