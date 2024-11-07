function generateInputs() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const inputFields = document.getElementById("inputFields");
    const algorithm = document.getElementById("algorithm").value;
    const timeQuantumContainer = document.getElementById("timeQuantumContainer");

    inputFields.innerHTML = ''; // Clear previous inputs if any

    // Show or hide Time Quantum input based on selected algorithm
    if (algorithm === "RoundRobin") {
        timeQuantumContainer.style.display = "block";
    } else {
        timeQuantumContainer.style.display = "none";
    }

    for (let i = 0; i < numProcesses; i++) {
        const div = document.createElement("div");
        div.innerHTML = `
            <label><b>Process ${i + 1}‎ ‎ ‎ ‎‎‎ ‎ ‎ </b>  </label>
            <label></label>
            <label>Arrival Time:</label>
            <input type="number" id="arrival${i}" min="0" required>
            <label>Burst Time:</label>
            <input type="number" id="burst${i}" min="1" required>
            <label>Priority:</label>
            <input type="number" id="priority${i}" min="0" required}>
        `;
        inputFields.appendChild(div);
    }

    document.getElementById("calculateBtn").style.display = "block";
}

function calculateScheduling() {
    const algorithm = document.getElementById("algorithm").value;

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
}

function calculateFCFS() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({ id: i + 1, arrivalTime, burstTime, priority });
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    const results = [];
    const ganttChartData = [];

    processes.forEach((process) => {
        const startTime = Math.max(currentTime, process.arrivalTime);
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            priority: process.priority,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        currentTime = completionTime;
    });

    results.sort((a, b) => a.processId - b.processId);

    displayResults(results, totalTurnaroundTime / numProcesses, totalWaitingTime / numProcesses);
    displayGanttChart(ganttChartData);
}

function calculateSJF() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({ id: i + 1, arrivalTime, burstTime, priority });
    }

    let currentTime = 0;
    const completed = Array(numProcesses).fill(false);
    let completedCount = 0;
    const results = [];
    const ganttChartData = [];

    // Continue until all processes are completed
    while (completedCount < numProcesses) {
        // Filter processes that have arrived and are not completed
        const availableProcesses = processes
            .map((p, index) => ({ ...p, index }))
            .filter(p => p.arrivalTime <= currentTime && !completed[p.index])
            .sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);

        if (availableProcesses.length === 0) {
            // No process available; increment time
            currentTime++;
            continue;
        }

        const process = availableProcesses[0]; // Pick process with shortest burst time
        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            priority: process.priority,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        currentTime = completionTime;
        completed[process.index] = true;
        completedCount++;
    }

    // Sort results by process ID for ascending order
    results.sort((a, b) => a.processId - b.processId);

    displayResults(results, calculateAverage(results, 'turnaroundTime'), calculateAverage(results, 'waitingTime'));
    displayGanttChart(ganttChartData);
}

function calculatePriority() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value) || 0;
        processes.push({ id: i + 1, arrivalTime, burstTime, priority });
    }

    let currentTime = 0;
    const completed = Array(numProcesses).fill(false);
    let completedCount = 0;
    const results = [];
    const ganttChartData = [];

    while (completedCount < numProcesses) {
        const availableProcesses = processes
            .map((p, index) => ({ ...p, index }))
            .filter(p => p.arrivalTime <= currentTime && !completed[p.index])
            .sort((a, b) => a.priority - b.priority);

        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        const process = availableProcesses[0];
        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        currentTime = completionTime;
        completed[process.index] = true;
        completedCount++;
    }

    results.sort((a, b) => a.processId - b.processId);

    displayResults(results, calculateAverage(results, 'turnaroundTime'), calculateAverage(results, 'waitingTime'));
    displayGanttChart(ganttChartData);
}

function calculateHRRN() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({ id: i + 1, arrivalTime, burstTime, priority });
    }

    let currentTime = 0;
    const completed = Array(numProcesses).fill(false);
    let completedCount = 0;
    const results = [];
    const ganttChartData = [];

    // Continue until all processes are completed
    while (completedCount < numProcesses) {
        // Filter processes that have arrived and are not completed
        const availableProcesses = processes
            .map((p, index) => ({ ...p, index }))
            .filter(p => p.arrivalTime <= currentTime && !completed[p.index])
            .map(p => ({
                ...p,
                responseRatio: ((currentTime - p.arrivalTime) + p.burstTime) / p.burstTime
            }))
            .sort((a, b) => b.responseRatio - a.responseRatio || a.arrivalTime - b.arrivalTime);

        if (availableProcesses.length === 0) {
            // No process available; increment time
            currentTime++;
            continue;
        }

        const process = availableProcesses[0]; // Pick process with highest response ratio
        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        results.push({
            processId: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            priority: process.priority,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        ganttChartData.push({
            processId: `P${process.id}`,
            startTime,
            endTime: completionTime,
        });

        currentTime = completionTime;
        completed[process.index] = true;
        completedCount++;
    }

    // Sort results by process ID for ascending order
    results.sort((a, b) => a.processId - b.processId);

    displayResults(results, calculateAverage(results, 'turnaroundTime'), calculateAverage(results, 'waitingTime'));
    displayGanttChart(ganttChartData);
}

function calculateSRTF() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({
            id: i + 1,
            arrivalTime,
            burstTime,
            priority,
            remainingTime: burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        });
    }

    const ganttChartData = [];
    let currentTime = 0;
    let completedCount = 0;
    const num = numProcesses;

    while (completedCount < numProcesses) {
        // Find process with minimum remaining time among the arrived processes
        let idx = -1;
        let minRemaining = Infinity;
        for (let i = 0; i < numProcesses; i++) {
            if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && processes[i].remainingTime < minRemaining) {
                minRemaining = processes[i].remainingTime;
                idx = i;
            }
        }

        if (idx === -1) {
            currentTime++;
            continue;
        }

        // Execute the process for 1 unit time
        if (ganttChartData.length === 0 || ganttChartData[ganttChartData.length - 1].processId !== `P${processes[idx].id}`) {
            ganttChartData.push({ processId: `P${processes[idx].id}`, startTime: currentTime });
        }

        processes[idx].remainingTime--;
        currentTime++;

        if (processes[idx].remainingTime === 0) {
            processes[idx].completionTime = currentTime;
            processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
            completedCount++;
            ganttChartData[ganttChartData.length - 1].endTime = currentTime;
        } else {
            // Check if next process is different
            const nextIdx = findNextProcessSRTF(processes, currentTime);
            if (nextIdx !== idx) {
                ganttChartData[ganttChartData.length - 1].endTime = currentTime;
            }
        }
    }

    // Sort results by process ID for ascending order
    const results = processes.map(p => ({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        priority: p.priority,
        completionTime: p.completionTime,
        turnaroundTime: p.turnaroundTime,
        waitingTime: p.waitingTime
    })).sort((a, b) => a.processId - b.processId);

    displayResults(results, calculateAverage(results, 'turnaroundTime'), calculateAverage(results, 'waitingTime'));
    displayGanttChart(ganttChartData);
}

function findNextProcessSRTF(processes, currentTime) {
    let idx = -1;
    let minRemaining = Infinity;
    for (let i = 0; i < processes.length; i++) {
        if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && processes[i].remainingTime < minRemaining) {
            minRemaining = processes[i].remainingTime;
            idx = i;
        }
    }
    return idx;
}

function calculatePriorityPreemptive() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({
            id: i + 1,
            arrivalTime,
            burstTime,
            priority,
            remainingTime: burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        });
    }

    const ganttChartData = [];
    let currentTime = 0;
    let completedCount = 0;
    const num = numProcesses;

    while (completedCount < numProcesses) {
        // Find process with highest priority among the arrived processes
        let idx = -1;
        let highestPriority = Infinity;
        for (let i = 0; i < numProcesses; i++) {
            if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && processes[i].priority < highestPriority) {
                highestPriority = processes[i].priority;
                idx = i;
            }
        }

        if (idx === -1) {
            currentTime++;
            continue;
        }

        // Execute the process for 1 unit time
        if (ganttChartData.length === 0 || ganttChartData[ganttChartData.length - 1].processId !== `P${processes[idx].id}`) {
            ganttChartData.push({ processId: `P${processes[idx].id}`, startTime: currentTime });
        }

        processes[idx].remainingTime--;
        currentTime++;

        if (processes[idx].remainingTime === 0) {
            processes[idx].completionTime = currentTime;
            processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
            completedCount++;
            ganttChartData[ganttChartData.length - 1].endTime = currentTime;
        } else {
            // Check if next process has different priority
            const nextIdx = findNextProcessPriorityPreemptive(processes, currentTime);
            if (nextIdx !== idx) {
                ganttChartData[ganttChartData.length - 1].endTime = currentTime;
            }
        }
    }

    // Sort results by process ID for ascending order
    const results = processes.map(p => ({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        priority: p.priority,
        completionTime: p.completionTime,
        turnaroundTime: p.turnaroundTime,
        waitingTime: p.waitingTime
    })).sort((a, b) => a.processId - b.processId);

    displayResults(results, calculateAverage(results, 'turnaroundTime'), calculateAverage(results, 'waitingTime'));
    displayGanttChart(ganttChartData);
}

function calculateRoundRobin() {
    const numProcesses = parseInt(document.getElementById("numProcesses").value);
    const timeQuantum = parseInt(document.getElementById("timeQuantum").value);
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);
        processes.push({
            id: i + 1,
            arrivalTime,
            burstTime,
            priority,

            remainingTime: burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        });
    }

    const ganttChartData = [];
    let currentTime = 0;
    let completedCount = 0;
    const queue = [];
    const num = numProcesses;
    const isInQueue = Array(numProcesses).fill(false);

    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (completedCount < numProcesses) {
        // Enqueue processes that have arrived by currentTime
        for (let i = 0; i < numProcesses; i++) {
            if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && !isInQueue[i]) {
                queue.push(processes[i]);
                isInQueue[i] = true;
            }
        }

        if (queue.length === 0) {
            // No process is ready to execute, increment time
            currentTime++;
            continue;
        }

        const currentProcess = queue.shift();
        isInQueue[currentProcess.id - 1] = false;

        const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);

        // Record Gantt chart entry
        if (ganttChartData.length === 0 || ganttChartData[ganttChartData.length - 1].processId !== `P${currentProcess.id}`) {
            ganttChartData.push({
                processId: `P${currentProcess.id}`,
                startTime: currentTime,
                endTime: currentTime + executionTime
            });
        } else {
            // Extend the endTime of the last Gantt chart entry
            ganttChartData[ganttChartData.length - 1].endTime += executionTime;
        }

        currentProcess.remainingTime -= executionTime;
        currentTime += executionTime;

        // Enqueue newly arrived processes during the execution time slice
        for (let i = 0; i < numProcesses; i++) {
            if (processes[i].arrivalTime > (currentTime - executionTime) && processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && !isInQueue[i]) {
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

    // Sort results by process ID for ascending order
    const results = processes.map(p => ({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        priority: p.priority,
        completionTime: p.completionTime,
        turnaroundTime: p.turnaroundTime,
        waitingTime: p.waitingTime
    })).sort((a, b) => a.processId - b.processId);

    displayResults(results, calculateAverage(results, 'turnaroundTime'), calculateAverage(results, 'waitingTime'));
    displayGanttChart(ganttChartData);
}

function calculateAverage(results, field) {
    return results.reduce((sum, r) => sum + r[field], 0) / results.length;
}

function displayResults(results, avgTurnaroundTime, avgWaitingTime) {
    const resultTableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
    const averageTimes = document.getElementById("averageTimes");

    resultTableBody.innerHTML = ''; // Clear previous results
    results.forEach((result) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.processId}</td>
            <td>${result.arrivalTime}</td>
            <td>${result.burstTime}</td>
            <td>${result.priority !== undefined ? result.priority : '-'}</td>
            <td>${result.completionTime}</td>
            <td>${result.turnaroundTime}</td>
            <td>${result.waitingTime}</td>
        `;
        resultTableBody.appendChild(row);
    });

    averageTimes.textContent = `Average Turnaround Time: ${avgTurnaroundTime.toFixed(2)}, Average Waiting Time: ${avgWaitingTime.toFixed(2)}`;
}

function displayGanttChart(ganttChartData) {
    const ganttProcessRow = document.getElementById("ganttProcessRow");
    const ganttTimeRow = document.getElementById("ganttTimeRow");

    ganttProcessRow.innerHTML = '';
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
        timeCell.textContent = `${startTime}  ‎ ‎ ‎ ‎ - ‎ ‎ ‎ ‎  ${endTime}`;
        ganttTimeRow.appendChild(timeCell);
    });
}

const memberButton = document.getElementById('memberButton');
const groupMembers = document.getElementById('groupMembers');

memberButton.addEventListener('click', function() {
  if (groupMembers.style.display === 'none' || groupMembers.style.display === '') {
    groupMembers.style.display = 'block';
    memberButton.textContent = 'Hide Members';
  } else {
    groupMembers.style.display = 'none';
    memberButton.textContent = 'Show Members';
  }
});
