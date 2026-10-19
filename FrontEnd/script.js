const employeeForm = document.getElementById("employeeForm");
const employeeTableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

let employees = JSON.parse(
    localStorage.getItem("employees")
) || [];

function saveEmployees() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function updateStatistics() {
    document.getElementById("totalEmployees").textContent =
        employees.length;

    const departments = new Set(
        employees.map(employee => employee.department)
    );

    document.getElementById("totalDepartments").textContent =
        departments.size;
}

function renderEmployees(searchText = "") {
    employeeTableBody.innerHTML = "";

    const filteredEmployees = employees.filter(employee => {
        const details = [
            employee.employeeId,
            employee.name,
            employee.email,
            employee.department,
            employee.position
        ].join(" ").toLowerCase();

        return details.includes(searchText.toLowerCase());
    });

    emptyMessage.style.display =
        filteredEmployees.length === 0 ? "block" : "none";

    if (filteredEmployees.length === 0) {
        emptyMessage.textContent = searchText ?
            "No matching employees found." :
            "No employees added yet. Add your first employee above.";
    }

    filteredEmployees.forEach(employee => {
        const row = document.createElement("tr");

        const values = [
            employee.employeeId,
            employee.name,
            employee.email,
            employee.department,
            employee.position,
            "₹" + Number(employee.salary).toLocaleString("en-IN", {
                maximumFractionDigits: 2
            }),
            employee.joiningDate
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.id = employee.employeeId;

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        employeeTableBody.appendChild(row);
    });

    updateStatistics();
}

employeeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const employee = {
        employeeId: document.getElementById("employeeId").value.trim(),
        name: document.getElementById("employeeName").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value,
        position: document.getElementById("position").value.trim(),
        salary: document.getElementById("salary").value,
        joiningDate: document.getElementById("joiningDate").value
    };

    const duplicateId = employees.some(existingEmployee =>
        existingEmployee.employeeId.toLowerCase() ===
        employee.employeeId.toLowerCase()
    );

    if (duplicateId) {
        alert("This Employee ID already exists. Please use another ID.");
        return;
    }

    employees.push(employee);

    saveEmployees();
    renderEmployees(searchInput.value);

    employeeForm.reset();

    alert("Employee added and saved successfully!");
});

searchInput.addEventListener("input", function() {
    renderEmployees(searchInput.value);
});

employeeTableBody.addEventListener("click", function(event) {
    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const employeeId = event.target.dataset.id;

    const confirmed = confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
        return;
    }

    employees = employees.filter(employee =>
        employee.employeeId !== employeeId
    );

    saveEmployees();
    renderEmployees(searchInput.value);
});

renderEmployees();