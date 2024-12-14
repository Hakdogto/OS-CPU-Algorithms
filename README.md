# Scheduling Algorithm Calculator  

This web-based tool is designed to help users calculate and visualize CPU scheduling algorithms, both preemptive and non-preemptive. Developed as a midterm laboratory assignment, it demonstrates the implementation of various scheduling algorithms, offering insights into process scheduling through dynamic tables and Gantt charts.

---

## Features  

- **Supported Algorithms**:
  - Non-preemptive:  
    - First Come First Serve (FCFS)  
    - Shortest Job First (SJF)  
    - Priority Scheduling  
    - Highest Response Ratio Next (HRRN)  
  - Preemptive:  
    - Shortest Remaining Time First (SRTF)  
    - Priority Scheduling  
    - Round Robin (RR)  

- **Dynamic Inputs**: Generate fields to input Arrival Time, Burst Time, and Priority Level based on the number of processes specified.  

- **Interactive Results**:
  - Displays computed values like Completion Time, Turnaround Time, Waiting Time, and Response Time in an easy-to-read table.  
  - Averages for Turnaround and Waiting Times are calculated and displayed.  
  - A Gantt Chart visualizes the sequence of process execution.  

- **Dark Mode**: Toggle between light and dark themes for a personalized experience.  

- **FAQ Section**: Built-in guide to explain how to use the tool effectively.  

- **Group Members Section**: Introduces the contributors to the project.  

---

## Technologies Used  

- **Frontend**: HTML, CSS, JavaScript  
- **Icons**: Font Awesome  
- **Design Features**: Responsive UI and dark mode functionality  

---

## Installation  

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/scheduling-algorithm-calculator.git
   
   cd scheduling-algorithm-calculator


---

## Usage  

1. Select a scheduling algorithm from the dropdown.  
2. Enter the number of processes.  
3. If using the Round Robin algorithm, specify the Time Quantum.  
4. Click "Generate Input Fields" and provide the required details (e.g., Arrival Time, Burst Time, Priority Level).  
5. Click "Calculate" to view the results, including the process table and Gantt Chart.  
6. Explore the FAQ section for detailed guidance on using the calculator.


## Team  

- **De Guzman, Aaliyah Jinealle** - *Project Manager*  
- **Lugtu, Allan Jay** - *Lead Developer*  
- **Cerezo, Justin Kurt** - *Junior Developer*  
- **Jaranilla, John Christian** - *UI Designer*  
- **Busante, Jerry** - *QA Tester*  


## Acknowledgments  

This project is dedicated to **Ma'am Ymelda C. Batalla**, whose guidance inspired its creation.  

Special thanks to all team members for their dedication and collaborative efforts.


## License  

This project is licensed under the MIT License. See the `LICENSE` file for details.  
