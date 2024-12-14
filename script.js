// Accordion functionality
var acc = document.getElementsByClassName("accordion");
var i;

// Add event listeners to all accordion elements
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    // Toggle active class for accordion and parent element
    this.classList.toggle("active");
    this.parentElement.classList.toggle("active");

    // Show or hide the next panel
    var pannel = this.nextElementSibling;
    if (pannel.style.display === "block") {
      pannel.style.display = "none";
    } else {
      pannel.style.display = "block";
    }
  });
}

// Dark mode toggle functionality
var icon = document.getElementById("icon");

icon.onclick = function () {
  // Toggle dark mode class on body element
  document.body.classList.toggle("darkmode");

  // Change icon based on dark mode state
  if (document.body.classList.contains("darkmode")) {
    icon.src = "./pictures/sun.png"; // Switch to sun icon
  } else {
    icon.src = "./pictures/moon.png"; // Switch to moon icon
  }
};

// Function to dynamically update the inputs based on the selected algorithm
function generateInputs() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const inputFields = document.getElementById("inputFields");
    const algorithm = document.getElementById("algorithm").value;
    const timeQuantumContainer = document.getElementById("timeQuantumContainer");

    // Clear previous inputs and results
    inputFields.innerHTML = '';
    document.getElementById("calculateBtn").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("ganttChart").style.display = "none";

    // Show Time Quantum input if Round Robin is selected
    if (algorithm === "RoundRobin") {
        timeQuantumContainer.style.display = "block";
    } else {
        timeQuantumContainer.style.display = "none";
    }

    // Validate the number of processes
    if (isNaN(numProcesses) || numProcesses <= 0) {
        alert("Please enter a valid number of processes.");
        return;
    }

    // Determine if Priority input is needed
    const showPriority = algorithm === "Priority" || algorithm === "PriorityPreemptive";

    // Create input fields dynamically
    for (let i = 0; i < numProcesses; i++) {
        const div = document.createElement("div");
        div.innerHTML = `
            <label><b>Process ${i + 1}</b></label>
            <label>Arrival Time:</label>
            <input type="number" id="arrival${i}" min="0" required>
            <label>Burst Time:</label>
            <input type="number" id="burst${i}" min="1" required>
            ${showPriority ? `
            <label>Priority:</label>
            <input type="number" id="priority${i}" min="0" required>
            ` : ''}
        `;
        inputFields.appendChild(div);
    }

    // Show the calculate button
    document.getElementById("calculateBtn").style.display = "block";
}
  
  // Reset inputs and hide results when the algorithm dropdown changes
  const algorithmDropdown = document.getElementById("algorithm");
  algorithmDropdown.addEventListener("change", () => {
    document.getElementById("inputFields").innerHTML = ''; // Clear inputs
    document.getElementById("timeQuantumContainer").style.display = "none"; // Hide time quantum
    document.getElementById("calculateBtn").style.display = "none"; // Hide calculate button
    document.getElementById("results").style.display = "none"; // Hide results
    document.getElementById("ganttChart").style.display = "none"; // Hide Gantt chart
  });
  
  // Main function to calculate scheduling based on the selected algorithm
  function calculateScheduling() {
    const algorithm = document.getElementById("algorithm").value;
  
    // Basic input validation: Check for empty fields
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    if (isNaN(numProcesses) || numProcesses <= 0) {
      alert("Invalid number of processes.");
      return;
    }
  
    for (let i = 0; i < numProcesses; i++) {
      const arrival = document.getElementById(`arrival${i}`);
      const burst = document.getElementById(`burst${i}`);
      if (!arrival || !burst || arrival.value === "" || burst.value === "") {
        alert(`Missing input for Process ${i + 1}. Please fill all fields.`);
        return;
      }
  
      if (algorithm === "Priority" || algorithm === "PriorityPreemptive") {
        const priority = document.getElementById(`priority${i}`);
        if (!priority || priority.value === "") {
          alert(`Missing priority input for Process ${i + 1}.`);
          return;
        }
      }
    }
  
    // Call appropriate scheduling calculation function
    switch (algorithm) {
      case "FCFS":
        calculateFCFS();
        break;
      case "SJF":
        calculateSJF();
        break;
      case "Priority":
        calculatePriority();
        break;
      case "HRRN":
        calculateHRRN();
        break;
      case "SRTF":
        calculateSRTF();
        break;
      case "PriorityPreemptive":
        calculatePriorityPreemptive();
        break;
      case "RoundRobin":
        calculateRoundRobin();
        break;
      default:
        alert("Please select a valid algorithm.");
    }
  
    // Display results and Gantt chart after calculation
    document.getElementById("results").style.display = "block";
    document.getElementById("ganttChart").style.display = "block";
  }

// Function to calculate the First Come First Serve (FCFS) scheduling algorithm.
function calculateFCFS() {
    // Retrieve the number of processes from user input.
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = []; // Array to store details of processes (id, arrival time, burst time).

    // Loop through the number of processes to gather user input for arrival and burst times.
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({ id: i + 1, arrivalTime, burstTime }); // Store process attributes in the array.
    }

    // Sort the processes based on their arrival time (FCFS rule).
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0; // Tracks the current time in the scheduling process.
    let totalTurnaroundTime = 0, totalWaitingTime = 0, totalResponseTime = 0;
    const results = []; // Array to store the final scheduling details for each process.
    const ganttChartData = []; // Array to store data for Gantt chart visualization.

    // Calculate scheduling details for each process.
    processes.forEach((process) => {
        // Start time considers the maximum of current time or process arrival time.
        const startTime = Math.max(currentTime, process.arrivalTime);
        const completionTime = startTime + process.burstTime; // Completion time = start time + burst time.
        const turnaroundTime = completionTime - process.arrivalTime; // Turnaround time = completion - arrival.
        const waitingTime = turnaroundTime - process.burstTime; // Waiting time = turnaround - burst.
        const responseTime = startTime - process.arrivalTime; // Response time = start time - arrival.

        // Store process details in results array.
        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        });

        // Add Gantt chart entry for the process.
        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        // Update totals for calculating averages later.
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        totalResponseTime += responseTime;

        // Update the current time for the next process.
        currentTime = completionTime;
    });

    // Sort results by process ID for organized output.
    results.sort((a, b) => a.processId - b.processId);

    // Display results and Gantt chart data.
    displayResults(
        results,
        totalTurnaroundTime / numProcesses, // Average Turnaround Time.
        totalWaitingTime / numProcesses,   // Average Waiting Time.
        totalResponseTime / numProcesses   // Average Response Time.
    );
    displayGanttChart(ganttChartData); // Show the Gantt chart.
}

// Function to calculate the Shortest Job First (SJF) scheduling algorithm.
function calculateSJF() {
    // Retrieve the number of processes from user input.
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = []; // Array to store process details.

    // Loop through the number of processes to collect input for arrival and burst times.
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({ id: i + 1, arrivalTime, burstTime }); // Store process attributes.
    }

    let currentTime = 0; // Tracks the current time in the scheduling.
    const completed = Array(numProcesses).fill(false); // Tracks whether a process is completed.
    let completedCount = 0; // Tracks the number of completed processes.
    let totalTurnaroundTime = 0, totalWaitingTime = 0, totalResponseTime = 0;
    const results = []; // Array to store scheduling results.
    const ganttChartData = []; // Array to store Gantt chart data.

    // Repeat until all processes are completed.
    while (completedCount < numProcesses) {
        // Filter the processes that have arrived and are not completed.
        const availableProcesses = processes
            .map((p, index) => ({ ...p, index })) // Add index for reference.
            .filter(p => p.arrivalTime <= currentTime && !completed[p.index])
            .sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime); // Sort by burst time, then arrival.

        // If no process is available, increment the current time.
        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        const process = availableProcesses[0]; // Select the process with the shortest burst time.
        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        const responseTime = startTime - process.arrivalTime;

        // Store process details in the results array.
        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        });

        // Add the process to the Gantt chart data.
        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        // Update totals for calculating averages later.
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        totalResponseTime += responseTime;

        // Mark process as completed and update the current time.
        completed[process.index] = true;
        completedCount++;
        currentTime = completionTime;
    }

    // Sort results by process ID for organized output.
    results.sort((a, b) => a.processId - b.processId);

    // Display results and Gantt chart data.
    displayResults(
        results,
        totalTurnaroundTime / numProcesses, // Average Turnaround Time.
        totalWaitingTime / numProcesses,   // Average Waiting Time.
        totalResponseTime / numProcesses   // Average Response Time.
    );
    displayGanttChart(ganttChartData); // Show the Gantt chart.
}

// Function to calculate the Priority scheduling algorithm.
function calculatePriority() {
    // Retrieve the number of processes from user input.
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = []; // Array to store process details.

    // Loop through the number of processes to collect input for arrival, burst times, and priority.
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value) || 0; // Default priority is 0 if not specified.
        processes.push({ id: i + 1, arrivalTime, burstTime, priority }); // Store process attributes.
    }

    let currentTime = 0; // Tracks the current time in the scheduling.
    const completed = Array(numProcesses).fill(false); // Tracks whether a process is completed.
    let completedCount = 0; // Tracks the number of completed processes.
    let totalTurnaroundTime = 0, totalWaitingTime = 0, totalResponseTime = 0;
    const results = []; // Array to store scheduling results.
    const ganttChartData = []; // Array to store Gantt chart data.

    // Repeat until all processes are completed.
    while (completedCount < numProcesses) {
        // Filter the processes that have arrived and are not completed.
        const availableProcesses = processes
            .map((p, index) => ({ ...p, index })) // Add index for reference.
            .filter(p => p.arrivalTime <= currentTime && !completed[p.index])
            .sort((a, b) => a.priority - b.priority); // Sort by priority (lower number = higher priority).

        // If no process is available, increment the current time.
        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        const process = availableProcesses[0]; // Select the process with the highest priority.
        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        const responseTime = startTime - process.arrivalTime;

        // Store process details in the results array.
        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            priority: process.priority,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        });

        // Add the process to the Gantt chart data.
        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        // Update totals for calculating averages later.
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        totalResponseTime += responseTime;

        // Mark process as completed and update the current time.
        completed[process.index] = true;
        completedCount++;
        currentTime = completionTime;
    }

    // Sort results by process ID for organized output.
    results.sort((a, b) => a.processId - b.processId);

    // Display results and Gantt chart data.
    displayResults(
        results,
        totalTurnaroundTime / numProcesses, // Average Turnaround Time.
        totalWaitingTime / numProcesses,   // Average Waiting Time.
        totalResponseTime / numProcesses   // Average Response Time.
    );
    displayGanttChart(ganttChartData); // Show the Gantt chart.
}

// Function to calculate the Highest Response Ratio Next (HRRN) scheduling algorithm.
function calculateHRRN() {
    // Retrieve the number of processes from user input.
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = []; // Array to store process details.

    // Loop through the number of processes to collect input for arrival and burst times.
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({ id: i + 1, arrivalTime, burstTime }); // Store process attributes.
    }

    let currentTime = 0; // Tracks the current time in the scheduling.
    const completed = Array(numProcesses).fill(false); // Tracks whether a process is completed.
    let completedCount = 0; // Tracks the number of completed processes.
    let totalTurnaroundTime = 0, totalWaitingTime = 0, totalResponseTime = 0;
    const results = []; // Array to store scheduling results.
    const ganttChartData = []; // Array to store Gantt chart data.

    // Repeat until all processes are completed.
    while (completedCount < numProcesses) {
        // Filter the processes that have arrived and are not completed, then calculate response ratio.
        const availableProcesses = processes
            .map((p, index) => ({ ...p, index })) // Add index for reference.
            .filter(p => p.arrivalTime <= currentTime && !completed[p.index])
            .map(p => ({
                ...p,
                responseRatio: ((currentTime - p.arrivalTime) + p.burstTime) / p.burstTime // HRRN formula.
            }))
            .sort((a, b) => b.responseRatio - a.responseRatio || a.arrivalTime - b.arrivalTime); // Sort by response ratio.

        // If no process is available, increment the current time.
        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        const process = availableProcesses[0]; // Select process with the highest response ratio.
        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        const responseTime = startTime - process.arrivalTime;

        // Store process details in the results array.
        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        });

        // Add the process to the Gantt chart data.
        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        // Update totals for calculating averages later.
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        totalResponseTime += responseTime;

        // Mark process as completed and update the current time.
        completed[process.index] = true;
        completedCount++;
        currentTime = completionTime;
    }

    // Sort results by process ID for organized output.
    results.sort((a, b) => a.processId - b.processId);

    // Display results and Gantt chart data.
    displayResults(
        results,
        totalTurnaroundTime / numProcesses, // Average Turnaround Time.
        totalWaitingTime / numProcesses,   // Average Waiting Time.
        totalResponseTime / numProcesses   // Average Response Time.
    );
    displayGanttChart(ganttChartData); // Show the Gantt chart.
}

// Shortest Remaining Time First (SRTF) Scheduling Algorithm
function calculateSRTF() {
    // Get the number of processes from user input
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    // Collect arrival time and burst time for each process
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({
            id: i + 1, // Process ID (1-based index)
            arrivalTime,
            burstTime,
            remainingTime: burstTime, // Initialize remaining time as burst time
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: -1 // Indicates if the response time has been calculated
        });
    }

    const ganttChartData = []; // Data for Gantt chart
    let currentTime = 0; // Tracks the current time
    let completedCount = 0; // Counts completed processes

    // Repeat until all processes are completed
    while (completedCount < numProcesses) {
        // Find the next process with the shortest remaining time
        const idx = findNextProcessSRTF(processes, currentTime);

        if (idx === -1) {
            // If no process is ready, increment the time
            currentTime++;
            continue;
        }

        // Update response time if this is the first execution of the process
        if (processes[idx].responseTime === -1) {
            processes[idx].responseTime = currentTime - processes[idx].arrivalTime;
        }

        // Add process to the Gantt chart if it hasn't been added or is different from the previous process
        if (ganttChartData.length === 0 || ganttChartData[ganttChartData.length - 1].processId !== `P${processes[idx].id}`) {
            ganttChartData.push({ processId: `P${processes[idx].id}`, startTime: currentTime });
        }

        // Execute the process for one time unit
        processes[idx].remainingTime--;
        currentTime++;

        if (processes[idx].remainingTime === 0) {
            // Process is completed
            processes[idx].completionTime = currentTime;
            processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
            completedCount++;
            ganttChartData[ganttChartData.length - 1].endTime = currentTime; // Mark end time on the Gantt chart
        } else {
            // Check if the next process changes and update Gantt chart end time
            const nextIdx = findNextProcessSRTF(processes, currentTime);
            if (nextIdx !== idx) {
                ganttChartData[ganttChartData.length - 1].endTime = currentTime;
            }
        }
    }

    // Prepare and display results
    const results = processes.map(p => ({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        completionTime: p.completionTime,
        turnaroundTime: p.turnaroundTime,
        waitingTime: p.waitingTime,
        responseTime: p.responseTime
    })).sort((a, b) => a.processId - b.processId);

    displayResults(
        results,
        calculateAverage(results, 'turnaroundTime'),
        calculateAverage(results, 'waitingTime'),
        calculateAverage(results, 'responseTime')
    );
    displayGanttChart(ganttChartData);
}

// Helper function to find the next process to execute in SRTF
function findNextProcessSRTF(processes, currentTime) {
    let idx = -1; // Index of the selected process
    let minRemaining = Infinity; // Minimum remaining time

    for (let i = 0; i < processes.length; i++) {
        if (
            processes[i].arrivalTime <= currentTime &&
            processes[i].remainingTime > 0
        ) {
            if (
                processes[i].remainingTime < minRemaining ||
                (processes[i].remainingTime === minRemaining &&
                 processes[i].arrivalTime < processes[idx]?.arrivalTime)
            ) {
                minRemaining = processes[i].remainingTime;
                idx = i;
            }
        }
    }
    return idx;
}



// Priority Scheduling (Preemptive) Algorithm
function calculatePriorityPreemptive() {
    // Get the number of processes from user input
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    // Collect arrival time, burst time, and priority for each process
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({
            id: i + 1, // Process ID (1-based index)
            arrivalTime,
            burstTime,
            priority,
            remainingTime: burstTime, // Initialize remaining time as burst time
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: -1 // Indicates if the response time has been calculated
        });
    }

    const ganttChartData = []; // Data for Gantt chart
    let currentTime = 0; // Tracks the current time
    let completedCount = 0; // Counts completed processes

    // Repeat until all processes are completed
    while (completedCount < numProcesses) {
        // Find the process with the highest priority (lowest priority value) that has arrived
        let idx = -1; // Index of the selected process
        let highestPriority = Infinity; // Lowest numerical value of priority is the highest

        for (let i = 0; i < numProcesses; i++) {
            if (
                processes[i].arrivalTime <= currentTime && // Process has arrived
                processes[i].remainingTime > 0 && // Process is not yet completed
                processes[i].priority < highestPriority // Process has higher priority
            ) {
                highestPriority = processes[i].priority;
                idx = i;
            }
        }

        if (idx === -1) {
            // If no process is ready, increment the time
            currentTime++;
            continue;
        }

        // Update response time if this is the first execution of the process
        if (processes[idx].responseTime === -1) {
            processes[idx].responseTime = currentTime - processes[idx].arrivalTime;
        }

        // Add process to the Gantt chart if it hasn't been added or is different from the previous process
        if (ganttChartData.length === 0 || ganttChartData[ganttChartData.length - 1].processId !== `P${processes[idx].id}`) {
            ganttChartData.push({ processId: `P${processes[idx].id}`, startTime: currentTime });
        }

        // Execute the process for one time unit
        processes[idx].remainingTime--;
        currentTime++;

        if (processes[idx].remainingTime === 0) {
            // Process is completed
            processes[idx].completionTime = currentTime;
            processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
            completedCount++;
            ganttChartData[ganttChartData.length - 1].endTime = currentTime; // Mark end time on the Gantt chart
        } else {
            // Check if the next process changes and update Gantt chart end time
            const nextIdx = findNextProcessPriorityPreemptive(processes, currentTime);
            if (nextIdx !== idx) {
                ganttChartData[ganttChartData.length - 1].endTime = currentTime;
            }
        }
    }

    // Prepare and display results
    const results = processes.map(p => ({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        priority: p.priority,
        completionTime: p.completionTime,
        turnaroundTime: p.turnaroundTime,
        waitingTime: p.waitingTime,
        responseTime: p.responseTime
    })).sort((a, b) => a.processId - b.processId);

    displayResults(
        results,
        calculateAverage(results, 'turnaroundTime'),
        calculateAverage(results, 'waitingTime'),
        calculateAverage(results, 'responseTime')
    );
    displayGanttChart(ganttChartData);
}

// Helper function to find the next process to execute in Priority Preemptive Scheduling
function findNextProcessPriorityPreemptive(processes, currentTime) {
    let idx = -1; // Index of the selected process
    let highestPriority = Infinity; // Lowest numerical value of priority is the highest

    for (let i = 0; i < processes.length; i++) {
        if (
            processes[i].arrivalTime <= currentTime && // Process has arrived
            processes[i].remainingTime > 0 && // Process is not yet completed
            processes[i].priority < highestPriority // Process has higher priority
        ) {
            highestPriority = processes[i].priority;
            idx = i;
        }
    }
    return idx;
}

// Round Robin Scheduling Algorithm
function calculateRoundRobin() {
    // Get the number of processes and time quantum from user input
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const timeQuantum = parseInt(document.getElementById("timeQuantum").value);
    const processes = [];

    // Collect arrival time and burst time for each process
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({
            id: i + 1, // Process ID (1-based index)
            arrivalTime,
            burstTime,
            remainingTime: burstTime, // Initialize remaining time as burst time
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: -1 // Indicates if the response time has been calculated
        });
    }

    const ganttChartData = []; // Data for Gantt chart
    let currentTime = 0; // Tracks the current time
    let completedCount = 0; // Counts completed processes
    const queue = []; // Process queue for Round Robin
    const isInQueue = Array(numProcesses).fill(false); // Tracks if a process is already in the queue

    // Sort processes by arrival time to simplify enqueueing
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Repeat until all processes are completed
    while (completedCount < numProcesses) {
        // Enqueue processes that have arrived by currentTime
        for (let i = 0; i < numProcesses; i++) {
            if (
                processes[i].arrivalTime <= currentTime &&
                processes[i].remainingTime > 0 &&
                !isInQueue[i]
            ) {
                queue.push(processes[i]);
                isInQueue[i] = true;
            }
        }

        if (queue.length === 0) {
            // No process is ready to execute, increment time
            currentTime++;
            continue;
        }

        const currentProcess = queue.shift(); // Dequeue the next process
        isInQueue[currentProcess.id - 1] = false;

        const executionTime = Math.min(timeQuantum, currentProcess.remainingTime); // Execute for either time quantum or remaining time

        // Set response time if it's the first time this process runs
        if (currentProcess.responseTime === -1) {
            currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
        }

        // Add process to Gantt chart or extend its end time
        if (
            ganttChartData.length === 0 ||
            ganttChartData[ganttChartData.length - 1].processId !== `P${currentProcess.id}`
        ) {
            ganttChartData.push({
                processId: `P${currentProcess.id}`,
                startTime: currentTime,
                endTime: currentTime + executionTime
            });
        } else {
            ganttChartData[ganttChartData.length - 1].endTime += executionTime;
        }

        currentProcess.remainingTime -= executionTime; // Deduct the executed time
        currentTime += executionTime;

        // Enqueue newly arrived processes during the execution time slice
        for (let i = 0; i < numProcesses; i++) {
            if (
                processes[i].arrivalTime > currentTime - executionTime &&
                processes[i].arrivalTime <= currentTime &&
                processes[i].remainingTime > 0 &&
                !isInQueue[i]
            ) {
                queue.push(processes[i]);
                isInQueue[i] = true;
            }
        }

        if (currentProcess.remainingTime > 0) {
            // Re-enqueue the process if it's not finished
            queue.push(currentProcess);
            isInQueue[currentProcess.id - 1] = true;
        } else {
            // Process is completed
            completedCount++;
            currentProcess.completionTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        }
    }

    // Prepare and display results
    const results = processes.map(p => ({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        completionTime: p.completionTime,
        turnaroundTime: p.turnaroundTime,
        waitingTime: p.waitingTime,
        responseTime: p.responseTime
    })).sort((a, b) => a.processId - b.processId);

    displayResults(
        results,
        calculateAverage(results, 'turnaroundTime'),
        calculateAverage(results, 'waitingTime'),
        calculateAverage(results, 'responseTime')
    );
    displayGanttChart(ganttChartData);
}


// Calculate the average value for a specific field
function calculateAverage(results, field) {
    return results.reduce((sum, r) => sum + r[field], 0) / results.length;
  }
  
  // Updated function to display results dynamically based on the algorithm
function displayResults(results, avgTurnaroundTime, avgWaitingTime, avgResponseTime) {
    const resultTableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
    const averageTimes = document.getElementById("averageTimes");

    // Clear previous results
    resultTableBody.innerHTML = '';

    // Check if Priority column is needed
    const selectedAlgorithm = document.getElementById("algorithm").value;
    const includePriority = selectedAlgorithm === "Priority" || selectedAlgorithm === "PriorityPreemptive";

    // Update table header
    const tableHeader = document.getElementById("resultTable").getElementsByTagName("thead")[0];
    tableHeader.innerHTML = `
        <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            ${includePriority ? '<th>Priority Level</th>' : ''}
            <th>Completion Time</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
            <th>Response Time</th>
        </tr>
    `;

    // Populate table rows
    results.forEach((result) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.processId}</td>
            <td>${result.arrivalTime}</td>
            <td>${result.burstTime}</td>
            ${includePriority ? `<td>${result.priority !== undefined && result.priority !== null ? result.priority : '-'}</td>` : ''}
            <td>${result.completionTime}</td>
            <td>${result.turnaroundTime}</td>
            <td>${result.waitingTime}</td>
            <td>${result.responseTime}</td>
        `;
        resultTableBody.appendChild(row);
    });

    // Display average metrics
    averageTimes.textContent = `Average Turnaround Time: ${avgTurnaroundTime.toFixed(2)}, Average Waiting Time: ${avgWaitingTime.toFixed(2)}, Average Response Time: ${avgResponseTime.toFixed(2)}`;
}

// Reset inputs when the algorithm is changed
document.getElementById("algorithm").addEventListener("change", () => {
    document.getElementById("inputFields").innerHTML = '';
    document.getElementById("timeQuantumContainer").style.display = "none";
    document.getElementById("calculateBtn").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("ganttChart").style.display = "none";
});
  
  // Display the Gantt chart based on scheduling data
  function displayGanttChart(ganttChartData) {
    const ganttProcessRow = document.getElementById("ganttProcessRow");
    const ganttTimeRow = document.getElementById("ganttTimeRow");
  
    ganttProcessRow.innerHTML = ''; // Clear previous data
    ganttTimeRow.innerHTML = '';
  
    // Merge consecutive entries for the same process
    const mergedGanttData = [];
    if (ganttChartData.length > 0) {
      let previousEntry = { ...ganttChartData[0] };
  
      for (let i = 1; i < ganttChartData.length; i++) {
        const currentEntry = ganttChartData[i];
  
        if (currentEntry.processId === previousEntry.processId) {
          // Extend the endTime of the previous entry
          previousEntry.endTime = currentEntry.endTime;
        } else {
          // Push the previous entry and start a new one
          mergedGanttData.push(previousEntry);
          previousEntry = { ...currentEntry };
        }
      }
  
      // Push the last entry
      mergedGanttData.push(previousEntry);
    }
  
    // Display merged Gantt data
    mergedGanttData.forEach(({ processId, startTime, endTime }) => {
      const processCell = document.createElement("th");
      processCell.textContent = processId;
      ganttProcessRow.appendChild(processCell);
  
      const timeCell = document.createElement("td");
      timeCell.textContent = `${startTime} - ${endTime}`;
      ganttTimeRow.appendChild(timeCell);
    });
  }
  
  // Toggle visibility of group members list
  const memberButton = document.getElementById('memberButton');
  const groupMembers = document.querySelector('.groupMembers'); // Select by class
  
  memberButton.addEventListener('click', function() {
    // Toggle visibility of group members section
    if (groupMembers.style.display === 'none' || groupMembers.style.display === '') {
      groupMembers.style.display = 'block';
      memberButton.textContent = 'Hide Members';
    } else {
      groupMembers.style.display = 'none';
      memberButton.textContent = 'Show Members';
    }
  });
  
