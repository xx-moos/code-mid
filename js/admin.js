import { formatDate, showToast, getAppointments, saveAppointments } from './utils.js';

class AdminDashboard {
  constructor() {
    this.appointments = getAppointments();
    this.currentPage = 1;
    this.pageSize = 10;
    this.setupEventListeners();
    this.updateDashboardStats();
    this.initializeFilters();
    this.updateAppointmentsTable();
  }

  // Event listeners for form submission and other events
  setupEventListeners() {
    // Search and filter events
    document
      .getElementById('searchInput')
      ?.addEventListener('input', () => this.filterAppointments());

    document
      .getElementById('filterDoctor')
      ?.addEventListener('change', () => this.filterAppointments());

    document
      .getElementById('filterDate')
      ?.addEventListener('change', () => this.filterAppointments());

    document
      .getElementById('filterStatus')
      ?.addEventListener('change', () => this.filterAppointments());

    document.getElementById('pageSize')?.addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value);
      this.currentPage = 1;
      this.updateAppointmentsTable();
    });

    // Pagination events
    document.getElementById('prevPage')?.addEventListener('click', () => this.changePage('prev'));
    document.getElementById('nextPage')?.addEventListener('click', () => this.changePage('next'));

    // Edit form submission
    document
      .getElementById('editForm')
      ?.addEventListener('submit', (e) => this.handleEditSubmit(e));

    // Sort headers
    document.querySelectorAll('th.cursor-pointer').forEach((th) => {
      th.addEventListener('click', () =>
        this.sortAppointments(th.textContent.trim().toLowerCase()),
      );
    });
  }

  // Update dashboard stats
  updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const totalAppointments = this.appointments.length;
    const todayAppointments = this.appointments.filter((app) => app.date === today).length;
    const cancelledAppointments = this.appointments.filter(
      (app) => app.status === 'Cancelled',
    ).length;
    const completedToday = this.appointments.filter(
      (app) => app.date === today && app.status === 'Completed',
    ).length;

    document.getElementById('totalAppointments').textContent = totalAppointments;
    document.getElementById('todayAppointments').textContent = todayAppointments;
    document.getElementById('cancelledAppointments').textContent = cancelledAppointments;
    document.getElementById('todayProgress').textContent = todayAppointments
      ? Math.round((completedToday / todayAppointments) * 100) + '%'
      : '0%';
    document.getElementById('cancellationRate').textContent = totalAppointments
      ? Math.round((cancelledAppointments / totalAppointments) * 100) + '%'
      : '0%';

    // Calculate average daily appointments
    const dates = [...new Set(this.appointments.map((app) => app.date))];
    const averageDaily = dates.length ? Math.round(totalAppointments / dates.length) : 0;
    document.getElementById('averageDaily').textContent = averageDaily;
  }

  // Initialize filters
  initializeFilters() {
    const doctors = [...new Set(this.appointments.map((app) => app.doctor))];
    const doctorSelect = document.getElementById('filterDoctor');
    if (doctorSelect) {
      doctors.forEach((doctor) => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
      });
    }
  }

  // Filter appointments
  filterAppointments() {
    this.currentPage = 1;
    this.updateAppointmentsTable();
  }

  // Get filtered appointments
  getFilteredAppointments() {
    let filtered = [...this.appointments];
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    const filterDoctor = document.getElementById('filterDoctor')?.value;
    const filterDate = document.getElementById('filterDate')?.value;
    const filterStatus = document.getElementById('filterStatus')?.value;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.patientName.toLowerCase().includes(searchTerm) ||
          app.patientPhone.includes(searchTerm),
      );
    }

    if (filterDoctor) {
      filtered = filtered.filter((app) => app.doctor === filterDoctor);
    }

    if (filterDate) {
      filtered = filtered.filter((app) => app.date === filterDate);
    }

    if (filterStatus) {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    return filtered;
  }

  // Update appointments table and pagination  render table
  updateAppointmentsTable() {
    const filtered = this.getFilteredAppointments();
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedAppointments = filtered.slice(start, end);

    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    console.log(`paginatedAppointments ->:`, paginatedAppointments);

    tbody.innerHTML = paginatedAppointments
      .map(
        (appointment) => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">${appointment.patientName}</td>
        <td class="px-6 py-4 whitespace-nowrap">${appointment.patientPhone}</td>
        <td class="px-6 py-4 whitespace-nowrap">${appointment.doctor}</td>
        <td class="px-6 py-4 whitespace-nowrap">${formatDate(
          appointment.date,
          appointment.time,
        )}</td>
        <td class="px-6 py-4 whitespace-nowrap">${appointment.appointmentType}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              appointment.status === 'Scheduled'
                ? 'bg-yellow-100 text-yellow-800'
                : appointment.status === 'Completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }">
            ${appointment.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <button onclick="adminDashboard.openEditModal('${appointment.id}')" 
            class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
          <button onclick="adminDashboard.deleteAppointment('${appointment.id}')"
            class="text-red-600 hover:text-red-900">Delete</button>
        </td>
      </tr>
    `,
      )
      .join('');

    this.updatePagination(filtered.length);
  }

  // Update pagination
  updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.pageSize);
    const pageNumbers = document.getElementById('pageNumbers');
    if (!pageNumbers) return;

    let pages = '';
    for (let i = 1; i <= totalPages; i++) {
      pages += `
        <button class="px-3 py-1 rounded border ${
          i === this.currentPage ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
        }" onclick="adminDashboard.goToPage(${i})">${i}</button>
      `;
    }
    pageNumbers.innerHTML = pages;

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    if (prevButton) prevButton.disabled = this.currentPage === 1;
    if (nextButton) nextButton.disabled = this.currentPage === totalPages;
  }

  // Change page
  changePage(direction) {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next') {
      const totalPages = Math.ceil(this.getFilteredAppointments().length / this.pageSize);
      if (this.currentPage < totalPages) {
        this.currentPage++;
      }
    }
    this.updateAppointmentsTable();
  }

  goToPage(page) {
    this.currentPage = page;
    this.updateAppointmentsTable();
  }

  // Sort appointments
  sortAppointments(field) {
    this.appointments.sort((a, b) => {
      if (field.includes('date & time')) {
        return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
      }
      if (field.includes('doctor')) {
        return a.doctor.localeCompare(b.doctor);
      }
      if (field.includes('patient name')) {
        return a.patientName.localeCompare(b.patientName);
      }
      return a[field].localeCompare(b[field]);
    });
    this.updateAppointmentsTable();
  }

  //  Open edit modal show edit form
  openEditModal(id) {
    const appointment = this.appointments.find((app) => app.id === id);
    if (!appointment) return;

    document.getElementById('editId').value = id;
    document.getElementById('editStatus').value = appointment.status;
    document.getElementById('editNotes').value = appointment.notes || '';
    document.getElementById('editModal').classList.remove('hidden');
  }

  // Handle edit form submission  edit modal form
  handleEditSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const appointment = this.appointments.find((app) => app.id === id);
    if (!appointment) return;

    appointment.status = document.getElementById('editStatus').value;
    appointment.notes = document.getElementById('editNotes').value;

    saveAppointments(this.appointments);
    showToast('Appointment updated successfully');
    document.getElementById('editModal').classList.add('hidden');
    this.updateDashboardStats();
    this.updateAppointmentsTable();
  }

  // Delete appointment
  deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    this.appointments = this.appointments.filter((app) => app.id !== id);
    saveAppointments(this.appointments);
    showToast('Appointment deleted successfully');
    this.updateDashboardStats();
    this.updateAppointmentsTable();
  }
}

const adminDashboard = new AdminDashboard();

window.adminDashboard = adminDashboard;
