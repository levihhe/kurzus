function loadData(type) {
    let url = type === 'courses' 
        ? 'https://vvri.pythonanywhere.com/api/courses' 
        : 'https://vvri.pythonanywhere.com/api/students';
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Hiba történt a ${type} betöltésekor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayData(data, type);
            document.getElementById('course-form').style.display = type === 'courses' ? 'block' : 'none';
            document.getElementById('student-form').style.display = type === 'students' ? 'block' : 'none';
        })
        .catch(error => console.error('Hiba történt:', error));
}

function displayData(data, type) {
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = '';

    if (data.length === 0) {
        dataList.innerHTML = '<p>Nincs adat</p>';
        return;
    }
    
    data.forEach(item => {
        let div = document.createElement('div');
        div.classList.add('item');

        if (type === 'courses') {
            let students = item.students;
            let studentNames = Array.isArray(students) && students.length > 0 
                ? students.map(s => s.name).join(', ') 
                : 'Nincs benne diák';

            div.innerHTML = `<strong>ID:</strong> ${item.id}<br>
                             <strong>Kurzus:</strong> <input type="text" value="${item.name}" id="course-name-${item.id}"><br>
                             <strong>Diákok:</strong> ${studentNames}<br><br>`;
            
            let buttonContainer = document.createElement('div');
            
            let saveButton = document.createElement('button');
            saveButton.textContent = 'Mentés';
            saveButton.onclick = () => saveCourse(item.id);
            buttonContainer.appendChild(saveButton);
            
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Törlés';
            deleteButton.onclick = () => deleteCourse(item.id);
            buttonContainer.appendChild(deleteButton);
            
            div.appendChild(buttonContainer);
        } else if (type === 'students') {
            div.innerHTML = `<strong>ID:</strong> ${item.id}<br>
                             <strong>Diák neve:</strong> <input type="text" value="${item.name}" id="student-name-${item.id}"><br><br>`;
            
            let buttonContainer = document.createElement('div');
            
            let saveButton = document.createElement('button');
            saveButton.textContent = 'Mentés';
            saveButton.onclick = () => saveStudent(item.id);
            buttonContainer.appendChild(saveButton);
            
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Törlés';
            deleteButton.onclick = () => deleteStudent(item.id);
            buttonContainer.appendChild(deleteButton);
            
            div.appendChild(buttonContainer);
        }
        
        dataList.appendChild(div);
    });
}

function addCourse() {
    const name = document.getElementById('course-name').value.trim();
    if (!name) {
        alert('Kérlek, add meg a kurzus nevét!');
        return;
    }
    
    fetch('https://vvri.pythonanywhere.com/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hiba történt a kurzus hozzáadásakor: ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('course-name').value = ''; // Clear input
        loadData('courses');
    })
    .catch(error => console.error('Hiba történt:', error));
}

function deleteCourse(id) {
    fetch(`https://vvri.pythonanywhere.com/api/courses/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hiba történt a kurzus törlésekor: ' + response.statusText);
        }
        // Reload the courses immediately after deletion
        loadData('courses');
    })
    .catch(error => console.error('Hiba történt:', error));
}

function saveCourse(id) {
    const newName = document.getElementById(`course-name-${id}`).value.trim();
    if (!newName) {
        alert('Kérlek, add meg a kurzus nevét!');
        return;
    }

    // Update the course directly if the API supports it
    fetch(`https://vvri.pythonanywhere.com/api/courses/${id}`, {
        method: 'PATCH', // Use PATCH if the API supports it
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }) // Only send the new name
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hiba történt a kurzus frissítésekor: ' + response.statusText);
        }
        return response.json();
    })
    .then(() => loadData('courses'))
    .catch(error => console.error('Hiba történt:', error));
}

function addStudent() {
    const name = document.getElementById('student-name').value.trim();
    if (!name) {
        alert('Kérlek, add meg a diák nevét!');
        return;
    }
    
    fetch('https://vvri.pythonanywhere.com/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }) // Ensure the body is correctly formatted
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hiba történt a diák hozzáadásakor: ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('student-name').value = ''; // Clear input
        loadData('students'); // Reload the student data
    })
    .catch(error => console.error('Hiba történt:', error));
}

function deleteStudent(id) {
    fetch(`https://vvri.pythonanywhere.com/api/students/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hiba történt a diák törlésekor: ' + response.statusText);
        }
        loadData('students');
    })
    .catch(error => console.error('Hiba történt:', error));
}

function saveStudent(id) {
    const newName = document.getElementById(`student-name-${id}`).value.trim();
    if (!newName) {
        alert('Kérlek, add meg a diák nevét!');
        return;
    }
    
    fetch(`https://vvri.pythonanywhere.com/api/students`, { 
        method: 'POST', // Change PUT to POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, name: newName }) // Include the ID in the body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Nem sikerült frissíteni a diákot: ' + response.statusText);
        }
        return response.json();
    })
    .then(() => loadData('students'))
    .catch(error => console.error('Hiba történt:', error));
}
