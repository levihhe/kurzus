const apiUrl = "https://vvri.pythonanywhere.com/api/courses";
const studentApiUrl = "https://vvri.pythonanywhere.com/api/students";

function show(type) {
    document.getElementById('courses').className = type === 'courses' ? 'visible' : 'hidden';
    document.getElementById('students').className = type === 'students' ? 'visible' : 'hidden';
}

function showCourseForm() {
    document.getElementById('courseForm').innerHTML = `
        <input type="text" id="courseName" placeholder="Kurzus név">
        <button onclick="createCourse()">Létrehozás</button>
    `;
    document.getElementById('courseForm').className = 'visible';
}

function showStudentForm() {
    document.getElementById('studentForm').innerHTML = `
        <input type="text" id="studentName" placeholder="Diák név">
        <button onclick="createStudent()">Létrehozás</button>
    `;
    document.getElementById('studentForm').className = 'visible';
}

function createCourse() {
    const courseName = document.getElementById('courseName').value;
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName })
    })
    .then(response => response.json())
    .then(() => {
        loadCourses();
        document.getElementById('courseForm').className = 'hidden';
        document.getElementById('courseName').value = '';
    });
}

function createStudent() {
    const studentName = document.getElementById('studentName').value;
    fetch(studentApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName })
    })
    .then(response => response.json())
    .then(() => {
        loadStudents();
        document.getElementById('studentForm').className = 'hidden';
        document.getElementById('studentName').value = '';
    });
}

function loadCourses() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const courseList = document.getElementById('courseList');
            courseList.innerHTML = data.map(course => `
                <div>
                    <h3>${course.name}</h3>
                    <button onclick="showEditCourseForm('${course.id}', '${course.name}')">Szerkesztés</button>
                    <button onclick="deleteCourse('${course.id}')">Törlés</button>
                </div>
            `).join('');
        });
}

function loadStudents() {
    fetch(studentApiUrl)
        .then(response => response.json())
        .then(data => {
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = data.map(student => `
                <div>
                    <h3>${student.name}</h3>
                    <button onclick="showEditStudentForm('${student.id}', '${student.name}')">Szerkesztés</button>
                    <button onclick="deleteStudent('${student.id}')">Törlés</button>
                </div>
            `).join('');
        });
}

function showEditCourseForm(id, name) {
    document.getElementById('courseForm').innerHTML = `
        <input type="text" id="editCourseName" value="${name}">
        <button onclick="editCourse('${id}')">Mentés</button>
    `;
    document.getElementById('courseForm').className = 'visible';
}

function showEditStudentForm(id, name) {
    document.getElementById('studentForm').innerHTML = `
        <input type="text" id="editStudentName" value="${name}">
        <button onclick="editStudent('${id}')">Mentés</button>
    `;
    document.getElementById('studentForm').className = 'visible';
}

function editCourse(id) {
    const courseName = document.getElementById('editCourseName').value;
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName })
    })
    .then(response => response.json())
    .then(() => {
        loadCourses();
        document.getElementById('courseForm').className = 'hidden';
        document.getElementById('editCourseName').value = '';
    });
}

function editStudent(id) {
    const studentName = document.getElementById('editStudentName').value;
    fetch(`${studentApiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName })
    })
    .then(response => response.json())
    .then(() => {
        loadStudents();
        document.getElementById('studentForm').className = 'hidden';
        document.getElementById('editStudentName').value = '';
    });
}

function deleteCourse(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => loadCourses());
}

function deleteStudent(id) {
    fetch(`${studentApiUrl}/${id}`, { method: 'DELETE' })
        .then(() => loadStudents());
}

// Betöltjük a kezdeti kurzusokat és diákokat
window.onload = () => {
    loadCourses();
    loadStudents();
};
