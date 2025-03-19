document.addEventListener("DOMContentLoaded", function () {
    const logbookForm = document.getElementById("logbook-form");
    const logbookTable = document.getElementById("logbook-table").querySelector("tbody");

    logbookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get input values
        const date = document.getElementById("date").value.trim();
        const vehicle = document.getElementById("vehicle").value.trim();
        const driver = document.getElementById("driver").value.trim();
        const distance = document.getElementById("distance").value.trim();

        // Validate input fields
        if (!date || !vehicle || !driver || !distance) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        // Create table row
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${date}</td>
            <td>${vehicle}</td>
            <td>${driver}</td>
            <td>${distance}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        // Append to table
        logbookTable.appendChild(newRow);

        // Clear form inputs
        logbookForm.reset();

        // Add event listener to delete button
        newRow.querySelector(".delete-btn").addEventListener("click", function () {
            newRow.remove();
        });
    });
});
