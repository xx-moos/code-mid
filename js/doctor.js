import { formatDate, showToast, getAppointments, saveAppointments } from './utils.js';

class DoctorDashboard {
  constructor() {
    this.appointments = getAppointments();
    this.currentPage = 1;
    this.pageSize = 10;
    this.setupEventListeners();
    this.updateDashboardStats();
    this.updateAppointmentList();
  }

  setupEventListeners() {
    // Filter events
    document
      .getElementById('departmentFilter')
      ?.addEventListener('change', () => this.filterAppointments());
    document
      .getElementById('dateFilter')
      ?.addEventListener('change', () => this.filterAppointments());
    document
      .getElementById('searchInput')
      ?.addEventListener('input', () => this.filterAppointments());

    // Pagination events
    document.getElementById('prevPage')?.addEventListener('click', () => this.changePage('prev'));
    document.getElementById('nextPage')?.addEventListener('click', () => this.changePage('next'));

    // Add status update function to window for HTML access
    window.updateAppointmentStatus = this.updateAppointmentStatus.bind(this);
  }

  // Update dashboard stats
  updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      total: this.appointments.length,
      today: this.appointments.filter((app) => app.date === today).length,
      confirmed: this.appointments.filter((app) => app.status === 'confirmed').length,
      pending: this.appointments.filter((app) => app.status === 'pending').length,
    };

    // Update stats in the UI if elements exist
    Object.entries(stats).forEach(([key, value]) => {
      const element = document.getElementById(`${key}Count`);
      if (element) element.textContent = value;
    });

    // Update completion rate
    const completionRate = document.getElementById('completionRate');
    if (completionRate) {
      const rate = stats.total ? Math.round((stats.confirmed / stats.total) * 100) : 0;
      completionRate.textContent = `${rate}%`;
    }
  }

  filterAppointments() {
    this.currentPage = 1;
    this.updateAppointmentList();
  }

  getFilteredAppointments() {
    const department = document.getElementById('departmentFilter')?.value;
    const date = document.getElementById('dateFilter')?.value;
    console.log(`date ->:`, date)
    const search = document.getElementById('searchInput')?.value?.toLowerCase();

    return this.appointments.filter((appointment) => {
      const matchDepartment = !department || appointment.department === department;
      const matchDate = !date || appointment.date === date;
      const matchSearch =
        !search ||
        appointment.name.toLowerCase().includes(search) ||
        appointment.phone.includes(search);
      return matchDepartment && matchDate && matchSearch;
    });
  }

  // Update the appointment list
  updateAppointmentList() {
    const filtered = this.getFilteredAppointments();
    console.log(`filtered ->:`, filtered)
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedAppointments = filtered.slice(start, end);
    console.log(`paginatedAppointments ->:`, paginatedAppointments);

    const appointmentList = document.getElementById('appointmentList');
    if (!appointmentList) return;

    appointmentList.innerHTML = paginatedAppointments
      .map(
        (appointment) => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">${formatDate(appointment.date)} ${
          appointment.time
        }</td>
        <td class="px-6 py-4 whitespace-nowrap">${appointment.patientName}</td>
        <td class="px-6 py-4 whitespace-nowrap">${appointment.patientPhone}</td>
        <td class="px-6 py-4">${appointment.appointmentType || '-'}</td>
        <td class="px-6 py-4">${appointment.symptoms || '-'}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button onclick="updateAppointmentStatus('${appointment.id}', '${
          appointment.status === 'confirmed' ? 'pending' : 'confirmed'
        }')"
              class="px-3 py-1 rounded-md text-sm ${
                appointment.status === 'confirmed'
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }">
              ${appointment.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
            </button>
            <button onclick="updateAppointmentStatus('${appointment.id}', 'cancelled')"
              class="px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200">
              Cancel
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join('');

    this.updatePagination(filtered.length);
  }

  updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.pageSize);
    const pageNumbers = document.getElementById('pageNumbers');
    if (!pageNumbers) return;

    let pages = '';
    for (let i = 1; i <= totalPages; i++) {
      pages += `
        <button class="px-3 py-1 rounded border ${
          i === this.currentPage ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
        }" onclick="doctorDashboard.goToPage(${i})">${i}</button>
      `;
    }
    pageNumbers.innerHTML = pages;

    // Update prev/next buttons
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    if (prevButton) prevButton.disabled = this.currentPage === 1;
    if (nextButton) nextButton.disabled = this.currentPage === totalPages;
  }

  changePage(direction) {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next') {
      const totalPages = Math.ceil(this.getFilteredAppointments().length / this.pageSize);
      if (this.currentPage < totalPages) {
        this.currentPage++;
      }
    }
    this.updateAppointmentList();
  }

  goToPage(page) {
    this.currentPage = page;
    this.updateAppointmentList();
  }

  updateAppointmentStatus(id, newStatus) {
    const appointment = this.appointments.find((a) => a.id === id);
    if (!appointment) return;

    appointment.status = newStatus;
    saveAppointments(this.appointments);

    const statusMessages = {
      confirmed: 'Appointment confirmed',
      pending: 'Appointment unconfirmed',
      cancelled: 'Appointment cancelled',
    };

    showToast(statusMessages[newStatus] || 'Status updated');
    this.updateDashboardStats();
    this.updateAppointmentList();
  }
}

// Initialize the doctor dashboard
const doctorDashboard = new DoctorDashboard();

// Add to window for HTML access   for HTML click use
window.doctorDashboard = doctorDashboard;
