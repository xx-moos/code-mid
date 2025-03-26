// Test data for the clinic management system
export const testAppointments = [
    {
        id: '1',
        patientName: 'John Smith',
        patientPhone: '123-456-7890',
        doctor: 'Dr. Sarah Wilson',
        date: '2024-12-10',
        time: '09:00',
        symptoms: 'Regular checkup',
        status: 'confirmed',
        appointmentType: 'in-person'
    },
    {
        id: '2',
        patientName: 'Emma Johnson',
        patientPhone: '234-567-8901',
        doctor: 'Dr. Michael Chen',
        date: '2024-12-10',
        time: '10:30',
        symptoms: 'Fever and headache',
        status: 'pending',
        appointmentType: 'in-person'
    },
    {
        id: '3',
        patientName: 'Robert Davis',
        patientPhone: '345-678-9012',
        doctor: 'Dr. Sarah Wilson',
        date: '2024-12-11',
        time: '14:00',
        symptoms: 'Annual physical',
        status: 'confirmed',
        appointmentType: 'in-person'
    },
    {
        id: '4',
        patientName: 'Maria Garcia',
        patientPhone: '456-789-0123',
        doctor: 'Dr. James Brown',
        date: '2024-12-12',
        time: '11:00',
        symptoms: 'Follow-up consultation',
        status: 'completed',
        appointmentType: 'in-person'
    },
    {
        id: '5',
        patientName: 'David Wilson',
        patientPhone: '567-890-1234',
        doctor: 'Dr. Michael Chen',
        date: '2024-12-12',
        time: '15:30',
        symptoms: 'Chronic back pain',
        status: 'confirmed',
        appointmentType: 'virtual'
    }
];

export const testDoctors = [
    {
        id: '1',
        name: 'Dr. Sarah Wilson',
        specialization: 'General Medicine',
        availability: ['Monday', 'Tuesday', 'Wednesday']
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Cardiology',
        availability: ['Tuesday', 'Thursday', 'Friday']
    },
    {
        id: '3',
        name: 'Dr. James Brown',
        specialization: 'Pediatrics',
        availability: ['Monday', 'Wednesday', 'Friday']
    }
];

// Function to load test data into localStorage
export const loadTestData = () => {
    localStorage.setItem('appointments', JSON.stringify(testAppointments));
    localStorage.setItem('doctors', JSON.stringify(testDoctors));
    console.log('Test data loaded successfully');
};

// Function to clear test data from localStorage
export const clearTestData = () => {
    localStorage.removeItem('appointments');
    localStorage.removeItem('doctors');
    console.log('Test data cleared successfully');
};
