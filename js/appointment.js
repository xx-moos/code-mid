// Appointment data management
class AppointmentManager {
  constructor() {
    this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    this.initializeTimeSlots();
    this.setupEventListeners();
    this.setMinDate();
  }

  // Initialize time options for the time select element
  initializeTimeSlots() {
    const timeSelect = document.getElementById('time');
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour}:00`);
      if (hour !== 17) times.push(`${hour}:30`);
    }
    timeSelect.innerHTML =
      '<option value="">Select time</option>' +
      times.map((time) => `<option value="${time}">${time}</option>`).join('');
  }

  // Set the minimum date for the date input
  setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Event listeners for form submission and other events
  setupEventListeners() {
    // Form submission
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const appointmentData = {
      id: Date.now().toString(),
      patientName: formData.get('patientName'),
      patientPhone: formData.get('patientPhone'),
      doctor: formData.get('doctor'),
      appointmentType: formData.get('appointmentType'),
      date: formData.get('date'),
      time: formData.get('time'),
      visitReason: formData.get('visitReason'),
      notes: formData.get('notes'),
      status: 'Scheduled',
    };

    // Validate phone number
    if (!/^\d{10,}$/.test(appointmentData.patientPhone)) {
      alert('Please enter a valid phone number with at least 10 digits');
      return;
    }

    // Validate date
    const selectedDate = new Date(appointmentData.date);
    if (selectedDate < new Date()) {
      alert('Cannot book appointments in the past');
      return;
    }

    // Check for double booking
    if (this.isDoubleBooked(appointmentData)) {
      alert('This time slot is already booked for the selected doctor');
      return;
    }

    // Save appointment
    this.appointments.push(appointmentData);
    this.saveToLocalStorage();
    this.showSuccessModal();

    // Reset form
    e.target.reset();
    this.initializeTimeSlots();
    this.setMinDate();
  }

  // Check for double booking
  isDoubleBooked(newAppointment) {
    return this.appointments.some(
      (appointment) =>
        appointment.doctor === newAppointment.doctor &&
        appointment.date === newAppointment.date &&
        appointment.time === newAppointment.time &&
        appointment.status !== 'Cancelled',
    );
  }

  saveToLocalStorage() {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }

  showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('hidden'), 3000);
  }
}

// Initialize the appointment manager
new AppointmentManager();

// To load the test data
import { loadTestData, clearTestData } from './testData.js';
loadTestData();
