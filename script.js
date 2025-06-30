// Tab Navigation

firstTime = true

document.querySelectorAll(".tab").forEach(tab => {

    tab.addEventListener("click", function () {
        document.querySelector(".tab.active").classList.remove("active");
        this.classList.add("active");

        document.querySelector(".tab-content.active").classList.remove("active");
        document.getElementById(this.dataset.tab).classList.add("active");

        // Save active tab to localStorage
        localStorage.setItem('activeTab', this.dataset.tab);

        if (this.dataset.tab === 'cg-calculate') {
            if (firstTime) {
                showToast('Use arrow keys to navigate quickly (←, →, ↑, ↓) .', 'success');





                firstTime = false;
            }

        }


        loadSavedSemesters(); // Always reload saved semesters
    });


});


window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.substring(1); // e.g., 'swe-outline'
    const defaultTab = "intro"; // fallback tab if hash not found

    if (hash) {
        const targetTab = document.querySelector(`.tab[data-tab="${hash}"]`);
        const targetContent = document.getElementById(hash);

        if (targetTab && targetContent) {
            // Remove existing active classes
            document.querySelector(".tab.active")?.classList.remove("active");
            document.querySelector(".tab-content.active")?.classList.remove("active");

            // Activate tab and content
            targetTab.classList.add("active");
            targetContent.classList.add("active");

            // Save to localStorage (optional)
            localStorage.setItem('activeTab', hash);

            // Optional: loadSavedSemesters or trigger any init logic
            if (hash === 'cg-calculate') {
                showToast('Use arrow keys to navigate quickly (←, →, ↑, ↓) .', 'success');
                firstTime = false;
            }

            loadSavedSemesters(); // your function
        }
    }
});




// Set default tab if no previous tab is recorded
document.addEventListener('DOMContentLoaded', () => {

    const isFirstVisit = localStorage.getItem('firstVisit');

    if (!isFirstVisit) {
        // Show welcome toast notification
        showToast('Welcome to GradeEasy! 🎉', 'success');

        // Set the firstVisit flag in localStorage
        localStorage.setItem('firstVisit', 'true');
    }

    let activeTab = localStorage.getItem('activeTab') || 'introduction';
    document.querySelector(`.tab[data-tab="${activeTab}"]`).classList.add('active');
    document.getElementById(activeTab).classList.add('active');
});

// Navigation Button (Introduction -> CG Calculate)
document.querySelector(".navigate-btn").addEventListener("click", function () {
    document.querySelector(".tab[data-tab='cg-calculate']").click();
});



// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast');

    if (type === 'warning' || type === 'error' || type === 'success') {
        toast.classList.add(type);
    }

    let emoji = '';
    if (type === 'success') {
        emoji = '✅ '; // Green checkmark emoji
    } else if (type === 'warning') {
        emoji = '⚠️ '; // Warning emoji
    } else if (type === 'error') {
        emoji = '❌ '; // Red exclamation emoji
    }
    toast.textContent = `${emoji}${message}`;

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    toast.appendChild(progressBar);

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.5s'; // Smooth opacity transition
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 5000); // Extend time to 5 seconds

}

// Button click event



document.addEventListener('DOMContentLoaded', () => {
    const inputBody = document.getElementById('inputBody');
    let rowCount = 0;
    // Add initial row
    addRow();

    document.getElementById('addRow').addEventListener('click', addRow);
    document.getElementById('calculate').addEventListener('click', calculateCGPA);


    const activeTab = localStorage.getItem('activeTab') || 'introduction';
    document.querySelector(`.tab[data-tab="${activeTab}"]`)?.classList.add('active');
    document.getElementById(activeTab)?.classList.add('active');

    inputBody.addEventListener('keydown', (e) => {
        const input = e.target;
        if (!input.matches('input')) return; // Only handle input elements

        const row = input.closest('tr');
        const inputs = Array.from(row.querySelectorAll('input'));
        const currentIndex = inputs.indexOf(input);
        let nextInput;

        switch (e.key) {
            case 'ArrowRight':
                if (currentIndex < inputs.length - 1) {
                    nextInput = inputs[currentIndex + 1];
                }
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    nextInput = inputs[currentIndex - 1];
                }
                break;
            case 'ArrowDown':
                const nextRow = row.nextElementSibling;
                if (nextRow) {
                    const nextInputs = Array.from(nextRow.querySelectorAll('input'));
                    nextInput = nextInputs[currentIndex] || nextInputs[nextInputs.length - 1];
                }
                break;
            case 'ArrowUp':
                const prevRow = row.previousElementSibling;
                if (prevRow) {
                    const prevInputs = Array.from(prevRow.querySelectorAll('input'));
                    nextInput = prevInputs[currentIndex] || prevInputs[prevInputs.length - 1];
                }
                break;
            case 'Enter':
                if (e.target.id !== 'calculate') {
                    calculateCGPA();
                }
                break;

        }

        if (nextInput) {
            e.preventDefault(); // Prevent default arrow key behavior
            nextInput.focus();
            nextInput.select(); // Optional: selects the text in the input
        }
    });


    function addRow() {
        rowCount++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rowCount}</td>
            <td><input placeholder="Course Name" type="text" class="course"></td>
            <td><input placeholder="CA Marks" type="number" class="ca" min="0"></td>
            <td><input placeholder="Mid Exam Marks" type="number" class="mid" min="0"></td>
            <td><input placeholder="Final Exam Marks" type="number" class="final" min="0"></td>
            <td><input placeholder="Credit" type="number" class="credit" min="1" max="4"></td>
            <td><button class="delete">Delete</button></td>
        `;
        inputBody.appendChild(row);

        row.querySelector('.delete').addEventListener('click', () => {
            row.remove();
            updateRowNumbers();
        });
    }

    function updateRowNumbers() {
        rowCount = 0;
        inputBody.querySelectorAll('tr').forEach((row) => {
            rowCount++;
            row.cells[0].textContent = rowCount;
        });
    }

    function calculateCGPA() {
        const semesterName = document.getElementById('semesterName').value.trim();
        if (!semesterName) {
            showToast('Please enter a semester name', 'error');
            return;
        }

        const selectedPresetId = document.getElementById('presetSelector').value;

        let preset = window.defaultPreset; // Use default preset if none selected
        if (selectedPresetId) {
            const presets = JSON.parse(localStorage.getItem('cgpaPresets')) || [];
            preset = presets.find(p => p.id === selectedPresetId);
            if (!preset) {
                showToast('Selected preset not found. Using default preset.', 'warning');
                preset = window.defaultPreset;
            }
        }

        const creditPerMarks = preset.marksPerCredit || (preset.totalMarks / preset.credit) || 100;
        if (!creditPerMarks || creditPerMarks <= 0) {
            showToast('Invalid marks per credit in preset. Please check the preset configuration.', 'error');
            return;
        }

        const rows = document.getElementById('inputBody').querySelectorAll('tr');
        const resultBody = document.getElementById('resultBody');
        resultBody.innerHTML = '';

        let totalGPCredit = 0;
        let totalCredits = 0;
        const semesterData = [];
        let hasFailed = false;
        let failedCourses = [];
        let shouldExist = false;
        let oneTime = true;

        rows.forEach((row, index) => {
            const course = row.querySelector('.course').value;
            const ca = parseFloat(row.querySelector('.ca').value) || 0;
            const mid = parseFloat(row.querySelector('.mid').value) || 0;
            const final = parseFloat(row.querySelector('.final').value) || 0;
            const credit = parseFloat(row.querySelector('.credit').value) || 0;

            if (!course || !credit) {
                if (oneTime) {
                    showToast('Please fill all fields', 'warning');
                    oneTime = false;
                }
                shouldExist = true;
                return;
            }

            const totalMarks = ca + mid + final;
            let percentage, gradePoint;

            percentage = (totalMarks / (credit * creditPerMarks)) * 100;
            if (percentage < 0 || percentage > 100) {
                showToast(`Invalid percentage (${percentage.toFixed(2)}%) for course ${course}. Please check input marks.`, 'error');
                return;
            }

            gradePoint = window.calculateGPA(percentage, preset);

            if (gradePoint.gp < 2.0) {
                hasFailed = true;
                failedCourses.push(course);
            }

            const resultRow = document.createElement('tr');
            resultRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${course}</td>
                <td>${ca}</td>
                <td>${mid}</td>
                <td>${final}</td>
                <td>${credit}</td>
                <td>${totalMarks}</td>
                <td>${(credit * creditPerMarks)}</td>
                <td>${percentage.toFixed(2)}</td>
                <td>${gradePoint.grade}</td>
                <td>${gradePoint.gp.toFixed(2)}</td>
                <td>${(gradePoint.gp * credit).toFixed(2)}</td>
            `;
            resultBody.appendChild(resultRow);

            if (document.getElementById('TrackthisCGPA').checked) {
                semesterData.push({ course, ca, mid, final, credit, totalMarks, percentage, grade: gradePoint.grade, gp: gradePoint.gp });
            }

            totalGPCredit += gradePoint.gp * credit;
            totalCredits += credit;
        });

        if (shouldExist) {
            return; // Exit if required fields are missing
        }

        if (hasFailed) {
            showToast(`You have failed in ${failedCourses.join(', ')}. Semester failed.`, 'warning');
            document.getElementById('cgpaResult').textContent = `CGPA: 0.00`;
            document.getElementById('resultSection').classList.remove('hidden');
            return; // Exit to prevent further processing
        }

        const cgpa = totalCredits > 0 ? (totalGPCredit / totalCredits).toFixed(2) : 0;
        document.getElementById('cgpaResult').textContent = `CGPA: ${cgpa}`;
        document.getElementById('resultSection').classList.remove('hidden');

        if (document.getElementById('TrackthisCGPA').checked) {
            const savedSemesters = JSON.parse(localStorage.getItem('semesters')) || {};
            savedSemesters[semesterName] = { cgpa, data: semesterData };
            localStorage.setItem('semesters', JSON.stringify(savedSemesters));
            showToast(`CGPA ${cgpa} saved for ${semesterName}, Check the Track CGPA Tab`, 'success');
            loadSavedSemesters();
        }
    }




});



function loadSemesterData(semesterName) {
    const savedSemesters = JSON.parse(localStorage.getItem('semesters')) || {};
    const semester = savedSemesters[semesterName];
    if (!semester) return;

    // Set semester name
    document.getElementById('semesterName').value = semesterName;

    // Clear existing rows
    const inputBody = document.getElementById('inputBody');
    inputBody.innerHTML = '';

    // Add rows for each course
    semester.data.forEach((row, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td><input placeholder="Course Name" type="text" class="course" value="${row.course}" aria-label="Course Name"></td>
            <td><input placeholder="CA Marks" type="number" class="ca" min="0" value="${row.ca}" aria-label="CA Marks"></td>
            <td><input placeholder="Mid Exam Marks" type="number" class="mid" min="0" value="${row.mid}" aria-label="Mid Exam Marks"></td>
            <td><input placeholder="Final Exam Marks" type="number" class="final" min="0" value="${row.final}" aria-label="Final Exam Marks"></td>
            <td><input placeholder="Credit" type="number" class="credit" min="1" max="4" value="${row.credit}" aria-label="Credit"></td>
            <td><button class="delete">Delete</button></td>
        `;
        inputBody.appendChild(newRow);

        // Add delete functionality
        newRow.querySelector('.delete').addEventListener('click', () => {
            newRow.remove();
            updateRowNumbers();
        });
    });
}





function loadSavedSemesters() {
    const savedSemesters = JSON.parse(localStorage.getItem('semesters')) || {};

    const graphData = Object.entries(savedSemesters).map(([name, { cgpa }]) => ({
        name,
        cgpa: parseFloat(cgpa)
    }));

    // Call graph function (you’ll write this)
    drawCGPAGraph(graphData);

    const trackSection = document.getElementById('specific-results');
    trackSection.innerHTML = '<h2>Saved Semesters</h2>';

    if (Object.keys(savedSemesters).length === 0) {
        trackSection.innerHTML += '<p>No saved semesters yet...<button class="navigate-to-cg">Calculate Now</button></p>';
        const navigateButton = trackSection.querySelector('.navigate-to-cg');
        navigateButton.addEventListener('click', () => {
            document.querySelector(".tab[data-tab='cg-calculate']").click();
        });

        return;
    }

    Object.entries(savedSemesters).forEach(([name, { cgpa, data }]) => {
        const semesterDiv = document.createElement('div');
        semesterDiv.classList.add('semester-entry');
        semesterDiv.innerHTML = `
            <div class="semester-header">
                <a href="#" class="semester-link" data-semester="${name}">${name} - CGPA: ${cgpa}</a>
                <div class='modify-buttons-in-track'>
                <button class="edit-semester" data-semester="${name}">Edit in Calculator</button>
                <button class="delete-semester" data-semester="${name}">Delete</button>
            
                </div>
            </div>
            <div class="semester-details" style="display: none;"></div>
        `;
        trackSection.appendChild(semesterDiv);

        // View details link


        const link = semesterDiv.querySelector('.semester-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const detailsDiv = semesterDiv.querySelector('.semester-details');
            if (detailsDiv.style.display === 'none') {
                showSemesterDetails(detailsDiv, data, cgpa);
                detailsDiv.style.display = 'block';
            } else {
                detailsDiv.style.display = 'none';
            }
        });

        const editBtn = semesterDiv.querySelector('.edit-semester');
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const semesterName = e.target.dataset.semester;
            // Switch to CG Calculate tab
            document.querySelector(".tab[data-tab='cg-calculate']").click();
            // Load semester data
            loadSemesterData(semesterName);
        });

        // Delete button
        const deleteBtn = semesterDiv.querySelector('.delete-semester');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deleteSemester(name);
            semesterDiv.remove();
            showToast(`Semester ${name} deleted`, 'error');
            loadSavedSemesters(); // Reload saved semesters after deletion
        });
    });
}

function showSemesterDetails(container, semesterData, cgpa) {
    container.innerHTML = `
        <table class="details-table">
            <thead>
                <tr>
                    <th>Course</th>
                    <th>CA</th>
                    <th>Mid</th>
                    <th>Final</th>
                    <th>Credit</th>
                    <th>Total Marks</th>
                    <th>%</th>
                    <th>Grade</th>
                    <th>GP</th>
                </tr>
            </thead>
            <tbody>
                ${semesterData.map(row => `
                    <tr>
                        <td>${row.course}</td>
                        <td>${row.ca}</td>
                        <td>${row.mid}</td>
                        <td>${row.final}</td>
                        <td>${row.credit}</td>
                        <td>${row.totalMarks}</td>
                        <td>${row.percentage.toFixed(2)}</td>
                        <td>${row.grade}</td>
                        <td>${row.gp}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style='margin : 10px'><strong>Semester CGPA: ${cgpa}</strong></p>
    `;
}

function deleteSemester(semesterName) {
    const savedSemesters = JSON.parse(localStorage.getItem('semesters')) || {};
    delete savedSemesters[semesterName];
    localStorage.setItem('semesters', JSON.stringify(savedSemesters));
}

// // Initial load of saved semesters if on Track CGPA tab
// const activeTab1 = localStorage.getItem('activeTab') || 'introduction';
// document.querySelector(`.tab[data-tab="${activeTab1}"]`)?.classList.add('active');
// document.getElementById(activeTab1)?.classList.add('active');

// // Load semesters immediately if starting on Track CGPA tab
// // if (activeTab1 === 'track-cgpa') {
// //     loadSavedSemesters();
// // }

loadSavedSemesters();


function drawCGPAGraph(data) {
    // Clear previous graph
    // Clear previous content
    d3.select('#cgpa-graph').selectAll('*').remove();

    // Detect screen size
    const isMobile = window.innerWidth < 768; // Common mobile breakpoint

    // Set dimensions based on screen size
    const width = isMobile ? 340 : 1120; // Smaller width for mobile
    const height = isMobile ? 150 : 300; // Smaller height for mobile
    const margin = {
        top: isMobile ? 15 : 20,       // Example: smaller margin for mobile
        right: isMobile ? 15 : 20,     // Example: smaller margin for mobile
        bottom: isMobile ? 30 : 50,     // Example: smaller margin for mobile
        left: isMobile ? 25 : 50       // Example: smaller margin for mobile
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#cgpa-graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);


    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerWidth])
        .padding(0.1);


    // Y-scale (CGPA 0-4)
    const yScale = d3.scaleLinear()
        .domain([0, 4]) // Fixed CGPA range

        .range([innerHeight, 0]); // Invert so 4 is at top 

    svg.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', isMobile ? '7px' : '15px')
        .attr('transform', 'rotate(-20)'); // Rotate labels for readability

    // Y-axis
    svg.append('g')
        .call(d3.axisLeft(yScale));
    svg.selectAll('text')
        .style('font-size', isMobile ? '7px' : '15px'); // Adjust font size for mobile

    // Add axis labels (optional)
    svg.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 40)
        .style('text-anchor', 'middle')
    // .text('Semesters');

    svg.append('text')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'middle')
    // .text('CGPA');

    svg.selectAll('.point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('cx', d => xScale(d.name) + xScale.bandwidth() / 2) // Center in band
        .attr('cy', d => yScale(d.cgpa))
        .attr('r', 5)
        .attr('fill', 'steelblue');

    // Add line (optional)
    const line = d3.line()
        .x(d => xScale(d.name) + xScale.bandwidth() / 2)
        .y(d => yScale(d.cgpa));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);



}



document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            item.classList.toggle('active');

        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // ... (your existing code)

    // Logo scroll behavior for mobile
    let lastScrollY = window.scrollY;
    const logo = document.querySelector('.aside .logo');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (window.innerWidth <= 768) { // Only on mobile
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scrolling down
                logo.classList.add('hidden');
            } else {
                // Scrolling up or at top
                logo.classList.remove('hidden');
            }
        }
        lastScrollY = currentScrollY;
    });

    // Ensure logo is visible on load
    if (window.scrollY <= 50) {
        logo.classList.remove('hidden');
    }
});








const courseData = {
    "Levels": [
        {
            "LevelName": "Level 1",
            "Terms": [
                {
                    "TermName": "Term 1",
                    "Subjects": [
                        {
                            "SubjectName": "PROG 101 : Structured Programming Language", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Overview",
                                    "Description": "History, Importance, Basic Structure, Programming Style"
                                },
                                {
                                    "Heading": "Constants, Variables, and Data Types",
                                    "Description": "Character Set, C Tokens, Keywords, and Identifiers, Constants, Variables, Data Types, Declaration of Variables, Declaration of Storage Class, Assigning Values to Variables, Defining Symbolic Constants, Declaring a Variable as Constant, Declaring a Variable as Volatile, Overflow and Underflow of Data"
                                },
                                {
                                    "Heading": "Operators and Expressions",
                                    "Description": "Arithmetic, Relational, Logical, Assignment, Increment and Decrement, Conditional, Bitwise, Special Operators, Arithmetic Expressions, Evaluation of Expressions, Type Conversions in Expressions, Operator Precedence and Associativity, Mathematical Functions"
                                },
                                {
                                    "Heading": "Managing Input and Output Operations",
                                    "Description": "Reading a Character, Writing a Character, Formatted Input, Formatted Output"
                                },
                                {
                                    "Heading": "Decision Making and Branching",
                                    "Description": "Decision Making with IF Statement, Simple IF Statement, The IF ELSE Statement, Nesting of IF ELSE Statements, The ELSE IF Ladder, The Switch Statement, The ?: Operator, The GOTO Statement"
                                },
                                {
                                    "Heading": "Loop",
                                    "Description": "Looping Basic, Necessity of Loops, The WHILE Statement, The DO Statement, The FOR Statement, Jumps in LOOPS, Entry Controlled Loops, Exit Controlled Loops, Concise Test Expression, Formulating Problems Using Loops; Nested Loop: Nesting of Two Loops, Example, Nesting of Independent Loops inside One, Example, Nesting of More Than Two Loops"
                                },
                                {
                                    "Heading": "Arrays",
                                    "Description": "Introduction, One-dimensional (1D) Arrays, Declaration and initialization of 1D Arrays, Two-dimensional (2D) Arrays, Declaration and initialization of 2D Arrays, Accessing arrays through Loops, Multi-dimensional Array, Dynamic Arrays"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Character Arrays and Strings",
                                    "Description": "Introduction, Declaring and Initializing String Variables, Difference between String and Character Array, I/O, Basic Operations without using Library Functions, Arithmetic Operations on Characters, String Library: Basic String Operations, Length, Compare, Concatenate, Substring, Reverse, String-handling Functions, Other Features of Strings"
                                },
                                {
                                    "Heading": "Functions-I",
                                    "Description": "Need for User-defined Functions, A Multi-function Program, Elements of User-defined Functions, Definition of Functions, Return Values and their Types, Function Calls, Function Declaration, Category of Functions, Local and Global Variables, No Arguments and no Return Values, All Arguments but no Return Values, Arguments with Return Values, No Arguments but Returns a Value, Functions that Return Multiple Values"
                                },
                                {
                                    "Heading": "Functions-II",
                                    "Description": "Nesting of Functions, Recursion, Passing Arrays to Functions, Passing Strings to Functions, The Scope, Visibility and Lifetime of Variables, Multi File Programs"
                                },
                                {
                                    "Heading": "Structures",
                                    "Description": "Basics, Necessity, Declaration, Accessing, Initialization, Arrays of Structures, Arrays within Structures, Structures and Functions"
                                },
                                {
                                    "Heading": "Pointers",
                                    "Description": "Understanding Pointers, Accessing the Address of a Variable, Declaring Pointer Variables, Initialization of Pointer Variables, Accessing a Variable through its Pointer, Chain of Pointers"
                                },
                                {
                                    "Heading": "Dynamic Memory Allocation",
                                    "Description": "Basics, Uses, Malloc, Free, Calloc, Realloc"
                                },
                                {
                                    "Heading": "File Management",
                                    "Description": "Basics, Uses, File Opening, Closing, File I/O, Use of Redirect Operator to Write in File or Read from File"
                                }]
                            }
                        },
                        { "SubjectName": "PROG 101 (lab) : Structured Programming Language", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SE 103 : Basic Principles of Software Engineering", "MidTerm": {
                                "Syllabus": [
                                    {
                                        "Heading": "Overview",
                                        "Description": "History , Nature , Relation of Software Engineering to Other Disciplines."
                                    },
                                    {
                                        "Heading": "Software Development Life Cycle",
                                        "Description": "Stages, SDLC Models (Water-fall, Iterative, V-Model, Spiral, Agile etc.), Software Prototyping."
                                    },
                                    {
                                        "Heading": "Software Requirement Analysis",
                                        "Description": "Types of Requirements, Inter view Process, User Story, Use Cases, Data Flow Diagram, Activity Diagrams, Sequence Diagram."
                                    },
                                    {
                                        "Heading": "Metrics and Measurement",
                                        "Description": "Software Quality Metrics, Object-Oriented Metrics, Measurement scales, Measurement for Decision Making, Measurement's Validity & Reliability, Measuring Usability & Productivity, Milestones, Estimation, Planning "
                                    },
                                    {
                                        "Heading": "Teams and Communication",
                                        "Description": "Working Solo vs as a Team, Team formation, Establish a collaboration process, Running a meeting, Divide work and integrate, Knowledge Sharing, Resolve Con-flicts, Interview Process "
                                    },
                                    {
                                        "Heading": "Risk and Mistakes Management",
                                        "Description": "Internal vs. External Risk, Lev-els of Risk Management, Risk Analysis, Risk Prioritization, Risk Control, DECIDE Model, The Swiss cheese model, OODA Loop, Generalization "
                                    },
                                    {
                                        "Heading": "Software Quality in Practice I",
                                        "Description": "Internal vs External Quality, Soft-ware Entropy, Technical Debt, Quality Practices (Trunk-Based Development, Squash and Merge) "
                                    },

                                ]
                            }, "FinalTerm": {
                                "Syllabus": [
                                    {
                                        "Heading": "Software Quality in Practice II",
                                        "Description": "Continuous Integration and De-ployment, Automation in Testing, Issue Reporting, Stack Tree, Assertion, Debugging, Unit Testing, Test Coverage etc. "
                                    },
                                    {
                                        "Heading": "Software Design and Architecture I",
                                        "Description": "Levels of Abstraction, De-sign vs. Architecture, Brief of Design Pattern, Common Views in Documenting Software Architecture "
                                    },
                                    {
                                        "Heading": "Software Design and Architecture II",
                                        "Description": "Common Software Archi-tectures (Pipes and Filters, Object-Oriented Organization, Event-Driven Architecture, Blackboard Architecture, Layered Systems etc.), Microservices and Service Oriented Architecture "
                                    },
                                    {
                                        "Heading": "Software Testing",
                                        "Description": " Automated Testing, Manual Testing, Black-Box Testing, White-Box Testing, Stress Testing, Profiling"
                                    },
                                    {
                                        "Heading": "Software Analysis",
                                        "Description": "Static vs Dynamic Analysis, Linters, Pattern Based Static Analysis "
                                    },
                                    {
                                        "Heading": "Agile Methodology",
                                        "Description": "Principles of Agile Software Development, Practices, Scrum Process, Extreme Programming "
                                    },
                                    {
                                        "Heading": "Secured Software Development",
                                        "Description": "Vulnerabilities, Attack Surfaces, Mitigations Strategies, Secured Design Principles, Threat Model-ing, STRIDE "
                                    },
                                ]
                            }
                        },
                        { "SubjectName": "SE 103 (lab) : Basic Principles of Software Engineering", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SEC 105 : Basic Principles of Cyber Security", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction",
                                    "Description": "Overview of Cyber Security, Importance of Cyber Security, Cyber Security Principles"
                                },
                                {
                                    "Heading": "Cyber Threats",
                                    "Description": "Types of Cyber Threats, Malware, Phishing, Social Engineering"
                                },
                                {
                                    "Heading": "Cyber Vulnerabilities",
                                    "Description": "Common Vulnerabilities, Vulnerability Assessment, Exploits"
                                },
                                {
                                    "Heading": "Cryptography Basics",
                                    "Description": "Introduction to Cryptography, Symmetric and Asymmetric Encryption, Hash Functions"
                                },
                                {
                                    "Heading": "Network Security",
                                    "Description": "Network Security Fundamentals, Firewalls, Intrusion Detection and Prevention Systems"
                                },
                                {
                                    "Heading": "Access Control",
                                    "Description": "Authentication Methods, Authorization, Access Control Models"
                                },
                                {
                                    "Heading": "Security Policies",
                                    "Description": "Importance of Security Policies, Developing Security Policies, Policy Implementation"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Risk Management",
                                    "Description": "Risk Assessment, Risk Mitigation Strategies, Incident Response"
                                },
                                {
                                    "Heading": "Security in Operating Systems",
                                    "Description": "Operating System Security Fundamentals, Patch Management, Secure Configuration"
                                },
                                {
                                    "Heading": "Web Security",
                                    "Description": "Securing Web Applications, Common Web Vulnerabilities, Secure Coding Practices"
                                },
                                {
                                    "Heading": "Cyber Attacks",
                                    "Description": "Introduction to DoS and DDoS Attacks, XSS, CSRF, SQL Injection, Biometric Bypass Techniques"
                                },
                                {
                                    "Heading": "Prevention of Cyber Attacks",
                                    "Description": "Preventing DoS and DDoS, Mitigating XSS and CSRF, Securing Databases against SQL Injection, Biometric Security Best Practices"
                                },
                                {
                                    "Heading": "Ethical and Legal Issues",
                                    "Description": "Cyber Laws, Ethical Hacking, Privacy Issues"
                                },
                                {
                                    "Heading": "Review and Project Presentations",
                                    "Description": "Review of Key Concepts, Student Presentations on Selected Topics, Course Summary and Q&A"
                                }]
                            }
                        },
                        {
                            "SubjectName": "DS 107 : Probability and Statistics", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Elements of Statistics",
                                    "Description": "Nature and scope; population and sample data, representation of statistical data, discrete and continuous variables"
                                },
                                {
                                    "Heading": "Central Limit Theorem",
                                    "Description": "Arithmetic mean, geometric mean, harmonic mean, median, mode"
                                },
                                {
                                    "Heading": "Measures of Dispersion",
                                    "Description": "Range, standard deviation, quartiles, deciles, percentiles, mean deviation, quartile deviation"
                                },
                                {
                                    "Heading": "Statistical Measures",
                                    "Description": "Coefficient of dispersion, coefficient of variation, measure of skewness, moments and kurtosis"
                                },
                                {
                                    "Heading": "Regression and Correlation",
                                    "Description": "Relationship between variables, fitting of regression lines, simple correlation"
                                },
                                {
                                    "Heading": "Multiple Correlation and Regression",
                                    "Description": "Correlation coefficient and regression coefficient"
                                },
                                {
                                    "Heading": "Elements of Probability",
                                    "Description": "Meaning and definition of probability, properties, basic terminology of probability, Bayes theorem, random variables, probability function"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Probability Distribution Function",
                                    "Description": "Binomial distribution, Poisson distribution, normal distribution, standard normal distribution, t-distribution, confidence level, estimation"
                                },
                                {
                                    "Heading": "Mathematical Expectation",
                                    "Description": "Meaning of mathematical expectation, expected value of a function of a random variable, expected value of a function of two random variables"
                                },
                                {
                                    "Heading": "Fundamentals of Hypothesis Testing",
                                    "Description": "Fundamentals of hypothesis testing"
                                },
                                {
                                    "Heading": "t-test and ANOVA Test",
                                    "Description": "t-test and ANOVA test"
                                },
                                {
                                    "Heading": "Markov Model",
                                    "Description": "Markov Model"
                                },
                                {
                                    "Heading": "Stochastic Analysis",
                                    "Description": "Stochastic Analysis"
                                },
                                {
                                    "Heading": "Queuing Analysis",
                                    "Description": "Queuing system, system performance measures, Queuing model"
                                }]
                            }
                        },
                        {
                            "SubjectName": "HIS 109 : History of the Emergence of Independent Bangladesh", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Naming Bangladesh",
                                    "Description": "History of Ancient and Medieval Bangladesh (Land formation, early settlement, Maurya, Pala and Sena Empires)"
                                },
                                {
                                    "Heading": "History of Ancient and Medieval Bangladesh",
                                    "Description": "Arrival of the Muslims, Ilyas Shahi and Hussain Shahi dynasty, Mughal Encounters with Bara Bhuiyans, Nawabism"
                                },
                                {
                                    "Heading": "War of Plassey and British Colonial Rule",
                                    "Description": "1757-1857; Sepoy Mutiny 1857"
                                },
                                {
                                    "Heading": "Nationalist Politics and Movement",
                                    "Description": "1857-1930s: The Partition of Bengal and Formation of Muslim League, Swadeshi movement and Annulment of Partition of Bengal"
                                },
                                {
                                    "Heading": "Khilafat and Non-Cooperation Movements",
                                    "Description": "Morley-Minto reforms 1909 and Government of India act 1919 and 1935; 1937 Provincial Elections and Forms of Government"
                                },
                                {
                                    "Heading": "Lahore Resolution and Pakistan Movement",
                                    "Description": "1930s-1947; Independent United Bengal Scheme; Indian Independence Act 1947: The partition of the subcontinent"
                                },
                                {
                                    "Heading": "Language Movement and National Identity",
                                    "Description": "The formation of Awami League; East Bengal Provincial Election in 1954 and the United Front"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Movement Against Education Commission Report",
                                    "Description": "Disparity between two parts of Pakistan and the Six Point movement"
                                },
                                {
                                    "Heading": "Agartala Conspiracy Case",
                                    "Description": "11-point movement of the students 1969; Mass upsurge of '69; General Election of 1970; Non-cooperation movement"
                                },
                                {
                                    "Heading": "Bangabandhu's Speech and Independence",
                                    "Description": "Crackdown and Genocide of March 25 and the beginning of the liberation war"
                                },
                                {
                                    "Heading": "Mujibnagar Government",
                                    "Description": "Liberation war: Freedom fighters and the sectors; Surrender of Pakistan Army"
                                },
                                {
                                    "Heading": "Role of Major Powers in 1971",
                                    "Description": "National and International media and the liberation war; Bangabandhu's return to Bangladesh"
                                },
                                {
                                    "Heading": "Nation Building",
                                    "Description": "Father of the Nation Bangabandhu Sheikh Mujibur Rahman and the early days of Bangladesh"
                                },
                                {
                                    "Heading": "Constitution of Bangladesh 1972",
                                    "Description": "Journey towards the Golden Bengal"
                                }]
                            }
                        }
                    ]
                },
                {
                    "TermName": "Term 2",
                    "Subjects": [
                        {
                            "SubjectName": "PROG 111 : Object Oriented Programming Language", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Philosophy of Object-Oriented Programming",
                                    "Description": "Advantages of OOP over structured programming; Introduction to C++ and Java; Data Types, Variables, Operators, Function, Arguments & Overloading in C++"
                                },
                                {
                                    "Heading": "Encapsulation, Classes and Objects",
                                    "Description": "Access specifiers, Inline Member Function, Friend Function, The 'this' Keyword, static and non-static members; Constructors, destructors, and copy constructors"
                                },
                                {
                                    "Heading": "Union and Objects",
                                    "Description": "Array of objects, object pointers, and object references"
                                },
                                {
                                    "Heading": "Inheritance in C++",
                                    "Description": "Types of inheritance, Overriding Member Function"
                                },
                                {
                                    "Heading": "Polymorphism in C++",
                                    "Description": "Overloading, abstract classes, Virtual and Pure Virtual Function"
                                },
                                {
                                    "Heading": "Java Architecture",
                                    "Description": "Features of Java, Java Development Kit (JDK), Data Types, Operators & Control Structures in Java"
                                },
                                {
                                    "Heading": "Exception Handling",
                                    "Description": "Types of Exception, Throws, Try & Catch Blocks, finally clause"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Object Oriented I/O",
                                    "Description": "Introduction to Stream, Bytes Stream & Character Stream, File, Filtered Bytes Stream, Object Serialization"
                                },
                                {
                                    "Heading": "Template Functions and Classes",
                                    "Description": "Template functions and classes"
                                },
                                {
                                    "Heading": "Multi-threaded Programming",
                                    "Description": "Using Multi-Threading and Multi-tasking, The Java Thread Model, Thread class and Runnable interface, Dead Lock"
                                },
                                {
                                    "Heading": "Generic Collections",
                                    "Description": "Generic Collections"
                                },
                                {
                                    "Heading": "Packages",
                                    "Description": "Packages"
                                },
                                {
                                    "Heading": "Applets & Application",
                                    "Description": "Java Applets, Java Application, Types of Java programs, Java Applets"
                                },
                                {
                                    "Heading": "AWT GUI Components",
                                    "Description": "Introduction About AWT, GUI Components, Java-AWT packages, Event Handling, Event Listener"
                                }]
                            }
                        },
                        { "SubjectName": "PROG 111 (lab) : Object Oriented Programming Language", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "CSE 113 : Data Structure and Algorithms", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction",
                                    "Description": "Basic concepts of data structure, Abstract Data Types (ADT), Data structure classification, Basic operations on data structures, Algorithm: Definition, Characteristics, and Complexity"
                                },
                                {
                                    "Heading": "Array",
                                    "Description": "Linear Array, Representation of Linear array in memory, Traversing, Insertion, Deletion, Searching: Linear Search & Binary Search, Sorting: Bubble Sort, Insertion Sort, Selection sort, Multidimensional Array, Pointer Array, Record"
                                },
                                {
                                    "Heading": "Algorithm Complexity",
                                    "Description": "Preliminary idea of an algorithm, Asymptotic Notation, runtime complexity (Big Oh notation), the preliminary idea of data structure space complexity, Trade of Time & Space complexity"
                                },
                                {
                                    "Heading": "Solving Recurrences",
                                    "Description": "Recursion Tree, Substitution Method, Master Method"
                                },
                                {
                                    "Heading": "Methods for Designing Efficient Algorithms",
                                    "Description": "Divide and conquer, Greedy method, Dynamic programming; Backtracking, etc."
                                },
                                {
                                    "Heading": "Linked List",
                                    "Description": "Representation of Linked Lists, Singly/doubly/circular linked lists, basic operations on linked lists (insertion, deletion, traverse, and searching). Header and two-way linked lists"
                                },
                                {
                                    "Heading": "Stack",
                                    "Description": "Basic stack operations (push/pop/peek), stack-class implementation using Array and linked list, in-fix to postfix expressions conversion and evaluation, balancing parentheses using stack"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Queue and Recursion",
                                    "Description": "Basic queue operations (enqueue, dequeue), circular queue/ dequeue, queue-class implementation using array and linked list, Priority queue application- Josephus problem, palindrome checker using stack and queue, Recursion: Basic idea of recursion (3 law cases, call itself, move towards the base case by state change), tracing output of a recursive function, applications- merge sort, permutation, combination"
                                },
                                {
                                    "Heading": "Tree (Part 1)",
                                    "Description": "General Tree: Implementation, application of general tree- file system. Binary Tree: Binary tree representation using array and pointers, traversal of Binary Tree (in-order, pre-order, and postorder), BST representation, basic operations on BST (creation, insertion, deletion, querying, and traversing)"
                                },
                                {
                                    "Heading": "Tree (Part 2)",
                                    "Description": "Huffman Tree, Huffman Coding: application- searching, sets, Heap: Min-heap, max-heap, Fibonacci-heap, applications- priority queue, Self-balancing Binary Search Tree: AVL tree (rotation, insertion); B Tree; Red Black Tree"
                                },
                                {
                                    "Heading": "Graph (Part 1)",
                                    "Description": "Graph representation (adjacency matrix/adjacency list), basic operations on graph (node/edge insertion and deletion), traversing a graph: breadth-first search (BFS)"
                                },
                                {
                                    "Heading": "Graph (Part 2)",
                                    "Description": "Depth-first search (DFS), Topological Sort, Floyd Warshall's Algorithm, Minimum Spanning Tree"
                                },
                                {
                                    "Heading": "Sorting and Set Operations",
                                    "Description": "Sorting: merge sort, quick sort. Set Operations: Set representation using bitmask, set/clear bit, querying the status of a bit, toggling bit values, LSB, and application of set operations"
                                },
                                {
                                    "Heading": "Disjoint Set and String ADT",
                                    "Description": "Disjoint Set: Union, find, path compression. String ADT: The concatenation of two strings, extracting substrings, searching a string for a matching substring, and parsing"
                                }]
                            }
                        },
                        { "SubjectName": "CSE 113 (lab) : Data Structure and Algorithms", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "CSE 115 : Discrete Mathematics and Graph Theory", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction",
                                    "Description": "Introduction to Discrete Mathematics, Propositional Logic, Logical Connectives, Truth Tables"
                                },
                                {
                                    "Heading": "Methods of Proof",
                                    "Description": "Direct Proof, Indirect Proof, Proof by Contradiction, Proof by Contrapositive"
                                },
                                {
                                    "Heading": "Set Theory",
                                    "Description": "Introduction to Sets, Venn Diagrams, Set Operations, Cartesian Products"
                                },
                                {
                                    "Heading": "Functions and Relations",
                                    "Description": "Definitions and Types, Injective, Surjective, and Bijective Functions, Definitions and Types of Relations, Properties of Relations"
                                },
                                {
                                    "Heading": "Counting Principles",
                                    "Description": "Basic Counting Principles, Permutations, Combinations, Binomial Theorem"
                                },
                                {
                                    "Heading": "Advanced Counting Techniques",
                                    "Description": "Pigeonhole Principle, Inclusion-Exclusion Principle, Recurrence Relations"
                                },
                                {
                                    "Heading": "Introduction to Graph Theory",
                                    "Description": "Graphs Definitions and Types, Graph Representations, Adjacency Matrices and Lists, Incidence Matrices"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Graph Properties and Types",
                                    "Description": "Degree of a Vertex, Paths and Cycles, Connected Graphs, Bipartite Graphs"
                                },
                                {
                                    "Heading": "Counting Techniques",
                                    "Description": "Counting Words Made with Elements of a Set S, Counting Words with Distinct Letters Made with Elements of a Set S, Counting Words Where Letters May Repeat, Counting Subsets, Pascal's Identity and Its Combinatorial Applications"
                                },
                                {
                                    "Heading": "Planar Graphs and Graph Coloring",
                                    "Description": "Planarity, Euler's Formula, Graph Coloring, Chromatic Number"
                                },
                                {
                                    "Heading": "Graph Algorithms",
                                    "Description": "Kruskal's Algorithm for Minimum Spanning Tree, Prim's Algorithm for Minimum Spanning Tree, Floyd-Warshall Algorithm for All-Pairs Shortest Paths, Bellman-Ford Algorithm for Shortest Path"
                                },
                                {
                                    "Heading": "Mathematical Structures",
                                    "Description": "Introduction to Algebraic Structures, Groups, Rings, and Fields, Lattices and Boolean Algebras"
                                },
                                {
                                    "Heading": "Applications of Discrete Mathematics",
                                    "Description": "Cryptography, Network Models, Coding Theory"
                                },
                                {
                                    "Heading": "Review and Project Presentations",
                                    "Description": "Review of Key Concepts, Student Presentations on Selected Topics, Course Summary and Q&A"
                                }]
                            }
                        },
                        {
                            "SubjectName": "SE 117 : System Analysis and Design", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to the System Analyst and Information System Development",
                                    "Description": "The Systems Analyst, Systems Development Life Cycle, Project Identification and Initiation, Feasibility Analysis"
                                },
                                {
                                    "Heading": "Introduction to Project Selection and Management",
                                    "Description": "Project Selection, Creating the Project Plan, Staffing the Project, Managing and Controlling the Project, Applying The Concepts At Tune Source"
                                },
                                {
                                    "Heading": "Requirements Determination",
                                    "Description": "Requirements elicitation Techniques, Requirements Analysis Strategies"
                                },
                                {
                                    "Heading": "Use Cases Analysis",
                                    "Description": "Elements of a Use Case, Use Cases and the Functional Requirements, Building Use Cases, Identifying the Major Use Cases"
                                },
                                {
                                    "Heading": "Data Flow Diagrams",
                                    "Description": "Elements of Data Flow Diagrams, Using Data Flow Diagrams to Define Business Processes, Creating Data Flow Diagrams, Creating Data Flow Diagram Fragments, Creating the Level 0 Data Flow Diagram, Creating Level 1 Data Flow Diagrams (and below), Validating the Data Flow Diagrams"
                                },
                                {
                                    "Heading": "The Entity Relationship Diagram",
                                    "Description": "Reading an Entity Relationship Diagram, Elements of an Entity Relationship Diagram, The Data Dictionary and Metadata, Building Entity Relationship Diagrams, Advanced Syntax"
                                },
                                {
                                    "Heading": "Transition from Requirements to Design",
                                    "Description": "System Acquisition Strategies, Influences on the Acquisition Strategy, Selecting an Acquisition Strategy"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Elements of an Architecture Design",
                                    "Description": "Creating an Architecture Design, Hardware and Software Specification"
                                },
                                {
                                    "Heading": "Principles for User Interface Design",
                                    "Description": "User Interface Design Process, Navigation Design, Input Design, Output Design"
                                },
                                {
                                    "Heading": "The Physical Data Flow Diagram",
                                    "Description": "Designing Programs, Structure Chart, Program Specification"
                                },
                                {
                                    "Heading": "Data Storage Formats",
                                    "Description": "Moving from Logical to Physical Data Models, Optimizing Data Storage"
                                },
                                {
                                    "Heading": "Managing the Programming Process",
                                    "Description": "Testing, Developing Documentation"
                                },
                                {
                                    "Heading": "Making the Transition to the New System",
                                    "Description": "The Migration Plan, Postimplementation Activities"
                                },
                                {
                                    "Heading": "Basic Characteristics of Object-Oriented Systems",
                                    "Description": "Object-Oriented Systems Analysis and Design, Use Case Diagram, Class Diagram, Sequence Diagram, Behavioral State Machine Diagram"
                                }]
                            }
                        },
                        { "SubjectName": "SE 117 (lab) : System Analysis and Design", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "MATH 209 : Engineering Mathematics", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Preliminaries of Computing",
                                    "Description": "Basic concepts, Floating point arithmetic, Types of errors and their computation, Convergence"
                                },
                                {
                                    "Heading": "Numerical Solution of Non-linear and Transcendental Equations",
                                    "Description": "Bisection method, Method of false position, Fixed point iteration, Newton-Raphson method"
                                },
                                {
                                    "Heading": "Interpolation and Polynomial Approximation",
                                    "Description": "Polynomial interpolation theory, Finite differences and their table, Taylor polynomials, Newton's Interpolation, Lagrange polynomials"
                                },
                                {
                                    "Heading": "Numerical Differentiation and Integration (Part 1)",
                                    "Description": "Numerical differentiation, Richardson's extrapolation"
                                },
                                {
                                    "Heading": "Numerical Differentiation and Integration (Part 2)",
                                    "Description": "Elements of Numerical Integration, Trapezoidal, Simpson's, Weddle's, etc., Adaptive quadrature method"
                                },
                                {
                                    "Heading": "Numerical Solutions of Linear Systems",
                                    "Description": "Direct methods for solving linear systems, Gaussian elimination and backward substitution, pivoting strategies, numerical factorizations"
                                },
                                {
                                    "Heading": "Iterative Methods",
                                    "Description": "Jacobi method, Gauss-Seidel method, and their convergence analysis"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Curve Fitting and Approximation",
                                    "Description": "Spline Interpolation and Cubic Splines, Least Squares Approximation"
                                },
                                {
                                    "Heading": "Approximating Eigenvalues",
                                    "Description": "Eigenvalues and eigenvectors, the power method, Convergence of Power method, Inverse Power method"
                                },
                                {
                                    "Heading": "Nonlinear System of Equations (Part 1)",
                                    "Description": "Fixed point for functions of several variables, Newton's method, Quasi-Newton's method"
                                },
                                {
                                    "Heading": "Nonlinear System of Equations (Part 2)",
                                    "Description": "Conjugate Gradient Method, Steepest Descent techniques"
                                },
                                {
                                    "Heading": "Initial Value Problems for ODE (Single-step Methods)",
                                    "Description": "Euler's and modified Euler's method, Higher order Taylor's method, and Runge-Kutta methods"
                                },
                                {
                                    "Heading": "Boundary Value Problem for ODE (Part 1)",
                                    "Description": "Shooting method for linear and nonlinear problems"
                                },
                                {
                                    "Heading": "Boundary Value Problem for ODE (Part 2)",
                                    "Description": "Finite difference methods for linear and nonlinear problems"
                                }]
                            }
                        }
                    ]
                }
            ]
        },
        {
            "LevelName": "Level 2",
            "Terms": [
                {
                    "TermName": "Term 1",
                    "Subjects": [
                        {
                            "SubjectName": "CSE 201 : Database Management System", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction",
                                    "Description": "Overview of Database Systems, Comparison with Traditional File Systems"
                                },
                                {
                                    "Heading": "Data Models",
                                    "Description": "Entity-Relationship (ER) Model, Entities, Attributes, Relationships, ER Diagrams"
                                },
                                {
                                    "Heading": "Relational Model",
                                    "Description": "Structure of Relational Databases, Relations, Tuples"
                                },
                                {
                                    "Heading": "Query Languages",
                                    "Description": "Introduction to Relational Algebra, Basic Operations"
                                },
                                {
                                    "Heading": "SQL",
                                    "Description": "Basics of SQL, Creating and Managing Tables, Simple Queries"
                                },
                                {
                                    "Heading": "Intermediate SQL",
                                    "Description": "Joins, Subqueries, Aggregation, and Grouping"
                                },
                                {
                                    "Heading": "Constraints and Triggers",
                                    "Description": "Integrity Constraints, Creating and Using Triggers"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Functional Dependencies and Normalization",
                                    "Description": "Understanding Dependencies, Normal Forms, Normalization Process"
                                },
                                {
                                    "Heading": "File Organization and Data Storage",
                                    "Description": "File Structures, Data Storage Techniques, Buffer Management"
                                },
                                {
                                    "Heading": "Indexing and Hashing",
                                    "Description": "Index Structures, B-Trees, Hash Functions, Index Maintenance"
                                },
                                {
                                    "Heading": "Query Optimization",
                                    "Description": "Techniques for Optimizing Queries, Cost-Based Optimization"
                                },
                                {
                                    "Heading": "Transaction Management",
                                    "Description": "ACID Properties, Transaction States, Serializability"
                                },
                                {
                                    "Heading": "Concurrency Control",
                                    "Description": "Locking Mechanisms, Deadlock Handling, Isolation Levels"
                                },
                                {
                                    "Heading": "Recovery Mechanisms and Advanced Topics",
                                    "Description": "Recovery Techniques, Object-Based Databases, Semi-Structured Databases"
                                }]
                            }
                        },
                        { "SubjectName": "CSE 201 (lab) : Database Management System", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "CSE 203 : Operating System and Unix Programming", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction and Operating System Concepts",
                                    "Description": "OS Concepts, Functions, Types of OS, OS Structures"
                                },
                                {
                                    "Heading": "Processes and Threads",
                                    "Description": "Process management, thread concepts, and scheduling"
                                },
                                {
                                    "Heading": "Memory Management",
                                    "Description": "Memory allocation, paging, segmentation, virtual memory"
                                },
                                {
                                    "Heading": "File Systems",
                                    "Description": "File system structure, access methods, and management"
                                },
                                {
                                    "Heading": "Input/Output, Deadlocks",
                                    "Description": "I/O management, deadlock detection, and prevention"
                                },
                                {
                                    "Heading": "Unix Programming",
                                    "Description": "Basic Unix commands, shell scripting, and system calls"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Unix Programming",
                                    "Description": "Advanced Unix programming, process control, and inter-process communication"
                                },
                                {
                                    "Heading": "Virtualization and the Cloud",
                                    "Description": "Concepts of virtualization, cloud computing, and their relation to OS"
                                },
                                {
                                    "Heading": "Multiple Processor Systems",
                                    "Description": "Multiprocessing, parallel computing, and OS support"
                                },
                                {
                                    "Heading": "Security",
                                    "Description": "OS security mechanisms, authentication, and access control"
                                },
                                {
                                    "Heading": "Embedded Operating System",
                                    "Description": "OS design for embedded systems and real-time applications"
                                },
                                {
                                    "Heading": "Operating System Design",
                                    "Description": "Principles and techniques for designing operating systems"
                                },
                                {
                                    "Heading": "Distributed Home Automation System",
                                    "Description": "OS support for distributed systems, focusing on home automation"
                                }]
                            }
                        },
                        { "SubjectName": "CSE 203 (lab) : Operating System and Unix Programming", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "PROG 211 : Android and Web Application Development", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Android App Development",
                                    "Description": "Welcome to Android Ville, The Android platform dissected, applications of Android development"
                                },
                                {
                                    "Heading": "Android Fundamentals",
                                    "Description": "Development environment, install IDE, Useful files in a project, Creating an Android Virtual Device, Building first app"
                                },
                                {
                                    "Heading": "Functionality",
                                    "Description": "Introducing various Activities, Intents, and Fragments, List views, the importance of those functionalities and their implementation"
                                },
                                {
                                    "Heading": "Design Challenges",
                                    "Description": "Various layouts, how to design XML files, building a simple App/Game"
                                },
                                {
                                    "Heading": "Services",
                                    "Description": "Background Services, Notifications service, Broadcast Receivers, and Data Persistence"
                                },
                                {
                                    "Heading": "Multithreading",
                                    "Description": "Processes, Threads, and Internet Access"
                                },
                                {
                                    "Heading": "App Publishing",
                                    "Description": "Build an app and Business strategy"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Web Engineering",
                                    "Description": "Introduction to Web Engineering, Web Application Categories & Characteristics"
                                },
                                {
                                    "Heading": "Web application requirement",
                                    "Description": "Requirement Engineering for Web Applications, Web Application Architectures, Design Principles of Web-based Applications"
                                },
                                {
                                    "Heading": "Client-side technologies",
                                    "Description": "Introduction to Client-side technology with HTML, CSS, Bootstrap, JavaScript, AJAX and ReactJS"
                                },
                                {
                                    "Heading": "Server-side technologies",
                                    "Description": "Approaches to running Server Programs, The Classic Technology: Common Gateway Interface (CGI): Definition, Characteristics, Introduction to PHP Programming, Introduction to FASTAPI"
                                },
                                {
                                    "Heading": "Web application maintenance",
                                    "Description": "Web Application Security, Testing and Quality Assurance, Operations & Maintenance of Web Applications"
                                }]
                            }
                        },
                        { "SubjectName": "PROG 211 (lab) : Android and Web Application Development", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SE 205 : Software Requirements Analysis and Specifications", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction",
                                    "Description": "Introduction to Software Requirements, Importance in SDLC"
                                },
                                {
                                    "Heading": "Requirements Elicitation",
                                    "Description": "Techniques (Interviews, Workshops), Use Case Modeling"
                                },
                                {
                                    "Heading": "Stakeholder Management",
                                    "Description": "Identifying Stakeholders, Managing Expectations"
                                },
                                {
                                    "Heading": "Requirements Analysis",
                                    "Description": "Functional vs. Non-functional Requirements, Prioritization"
                                },
                                {
                                    "Heading": "Modeling Techniques",
                                    "Description": "UML, Data Flow Diagrams, Scenario-based Modeling"
                                },
                                {
                                    "Heading": "Requirements Validation",
                                    "Description": "Techniques, Testing, Acceptance Criteria"
                                },
                                {
                                    "Heading": "Writing Specifications",
                                    "Description": "Structure, Clarity, Unambiguity, SRS Documentation"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Managing Changes",
                                    "Description": "Change Management Processes, Impact Analysis, Version Control"
                                },
                                {
                                    "Heading": "Agile Methodology",
                                    "Description": "Agile Principles, User Stories, Continuous Integration"
                                },
                                {
                                    "Heading": "Requirement Specification",
                                    "Description": "Writing Clear Specifications, Use Cases, User Stories"
                                },
                                {
                                    "Heading": "Regulatory Compliance",
                                    "Description": "Standards (e.g., GDPR, ISO/IEC 29148), Legal Aspects"
                                },
                                {
                                    "Heading": "Advanced Topics",
                                    "Description": "Security Requirements, Safety-critical Systems"
                                },
                                {
                                    "Heading": "Emerging Trends",
                                    "Description": "AI in Requirements Engineering, DevOps Impact, Ethical Considerations: Privacy, Professional Ethics"
                                },
                                {
                                    "Heading": "Case Study and Real-Life Project Analysis",
                                    "Description": "Case Studies, Real-Life Project Review, Lessons Learned"
                                }]
                            }
                        },
                        { "SubjectName": "SE 205 (lab) : Software Requirements Analysis and Specifications", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "MATH 217 : Advanced Mathematics", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Linear Algebra",
                                    "Description": "Solution of a system of linear equations, Gaussian elimination, Gauss-Jordan elimination"
                                },
                                {
                                    "Heading": "Linear Algebra",
                                    "Description": "Dimension, rank, and nullity"
                                },
                                {
                                    "Heading": "Linear Algebra",
                                    "Description": "Elementary transformations of matrices, matrix polynomials, linear span, linear independence, linear dependence, coordinates, and bases"
                                },
                                {
                                    "Heading": "Linear Algebra",
                                    "Description": "Vector product, scalar product, scalar triple product, vector triple product, eigenvalues, and eigenvectors"
                                },
                                {
                                    "Heading": "Linear Algebra",
                                    "Description": "LU factorization, singular value decomposition"
                                },
                                {
                                    "Heading": "Complex Variable",
                                    "Description": "Complex numbers and their geometric representation, polar form of complex numbers, powers, and roots"
                                },
                                {
                                    "Heading": "Complex Variable",
                                    "Description": "Derivative, analytic function, Cauchy-Riemann equations"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Laplace Transform",
                                    "Description": "Laplace transforms and basic theorems on Laplace transform"
                                },
                                {
                                    "Heading": "Laplace Transform",
                                    "Description": "Inverse Laplace transforms elementary functions, convolution theorem"
                                },
                                {
                                    "Heading": "Laplace Transform",
                                    "Description": "Application of Laplace transforms to the solution of differential equations and system of differential equations"
                                },
                                {
                                    "Heading": "Fourier Analysis",
                                    "Description": "Fourier series and transform"
                                },
                                {
                                    "Heading": "Fourier Analysis",
                                    "Description": "Fourier coefficients, odd and even functions"
                                },
                                {
                                    "Heading": "Fourier Analysis",
                                    "Description": "The complex form of Fourier Transformation and series"
                                },
                                {
                                    "Heading": "Fourier Analysis",
                                    "Description": "Applications of Fourier Series and Transformation"
                                }]
                            }
                        }
                    ]
                },
                {
                    "TermName": "Term 2",
                    "Subjects": [
                        {
                            "SubjectName": "SE 207 : Advanced Database Management System", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Distributed Databases",
                                    "Description": "Definition of Distributed Databases and Distributed Database Management System (DDBMS), Understanding the concept of Distributed Transparent Systems, Overview of DDBMS Architecture: DBMS Standardization, Global, Local, External, and Internal Schemas"
                                },
                                {
                                    "Heading": "Distributed Database Design",
                                    "Description": "Exploring design problems in Distributed Systems, Analysis of Design Strategies: Top-Down and Bottom-Up Approaches, Understanding Fragmentation, Allocation, and Replication of Fragments in Distributed Databases"
                                },
                                {
                                    "Heading": "Query Processing",
                                    "Description": "Overview of Query Processing in Distributed Databases, Importance of Query Optimization in Distributed Environments"
                                },
                                {
                                    "Heading": "Transaction Management in Distributed Databases",
                                    "Description": "Definition and Examples of Transactions, Formalization of Transactions and ACID Properties, Classification of Transactions"
                                },
                                {
                                    "Heading": "Concurrency Control in Distributed Databases",
                                    "Description": "Understanding Concurrency Control mechanisms, Execution Schedules and Examples, Exploring Locking-based and Timestamp Ordering Algorithms"
                                },
                                {
                                    "Heading": "DBMS Reliability in Distributed Systems",
                                    "Description": "Definitions and Basic Concepts, Local Recovery Management, In-place and Out-of-place Update Strategies"
                                },
                                {
                                    "Heading": "Distributed Reliability Protocols",
                                    "Description": "Two-Phase Commit Protocol, Three-Phase Commit Protocol, Deadlock Management Techniques"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Parallel Database Systems",
                                    "Description": "Introduction to Parallel Database Systems, Speed-up and Scale-up in Parallel Query Evaluation"
                                },
                                {
                                    "Heading": "Parallel Query Evaluation Techniques",
                                    "Description": "Understanding I/O Parallelism (Data Partitioning), Exploring Intra-query and Inter-query Parallelism"
                                },
                                {
                                    "Heading": "Database Systems Architectures",
                                    "Description": "Comparison between Row Stores and Column Stores, Understanding OLTP vs. OLAP Systems, Introduction to In-Memory Database Systems"
                                },
                                {
                                    "Heading": "Data Models in Distributed Databases",
                                    "Description": "Analysis of Relational, Object-Oriented, and NoSQL Data Models, Importance of Data Modeling in Distributed Environments"
                                },
                                {
                                    "Heading": "Indexing Techniques",
                                    "Description": "Tree-based and Hash-based Indexing, Multidimensional Indexing, Learning Indices from Data"
                                },
                                {
                                    "Heading": "Write-Optimized Data Structures",
                                    "Description": "Exploring LSM Trees, LSM Hash Tables, Bε Trees, Understanding their Role in Database Optimization"
                                },
                                {
                                    "Heading": "Advanced Database Applications",
                                    "Description": "Data Warehousing and Decision Support Systems: OLAP, Materialized Views, Incremental View Maintenance, Stream Processing Systems and Data Streaming Algorithms, Database Systems for Scientific (Array) Databases, Cloud Databases, and Machine Learning, Overview of Deductive, Active, Multimedia, and XML Databases"
                                }]
                            }
                        },
                        { "SubjectName": "SE 207 (lab) : Advanced Database Management System", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SE 213 : Software Architecture and Design", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Software Architecture and Design",
                                    "Description": "Introduction to Software Architecture, Introduction to Software Design, Design Vs. Architecture"
                                },
                                {
                                    "Heading": "Software Architecture Core Concepts",
                                    "Description": "Define Software Architecture, Architecture Address NFR, Architectures and Technologies"
                                },
                                {
                                    "Heading": "Software Architecture Business Cycle",
                                    "Description": "Where do architecture comes from, Software process and architecture business cycle, what makes a good architecture"
                                },
                                {
                                    "Heading": "Software Architecture Business Cycle",
                                    "Description": "Activities in software process and architecture business cycle, Architectural Structures and views"
                                },
                                {
                                    "Heading": "Quality Attributes in Software Architecture",
                                    "Description": "Motivation, what are the different Quantity attributes, Performance, Scalability, Modifiability, Security, Availability, Robustness, How to Achieve quality attributes at architectural level"
                                },
                                {
                                    "Heading": "Software Architecture Process",
                                    "Description": "Process Outline, Architecture Design, Validation"
                                },
                                {
                                    "Heading": "Case Study",
                                    "Description": "Architecture Patterns, Structural View, Behavioral View, Implementation Issues"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Documenting Software Architecture",
                                    "Description": "Architecture Requirements, Solution Architecture Analysis"
                                },
                                {
                                    "Heading": "Introduction to design",
                                    "Description": "Introduction to Unified modelling language (UML)"
                                },
                                {
                                    "Heading": "Introduction to design",
                                    "Description": "Structural and behavioral diagrams"
                                },
                                {
                                    "Heading": "Modeling structural and behavioral diagram",
                                    "Description": "Modeling structural (class diagram) and behavioral diagram (use case, sequence diagram and state machine diagram) of online shopping application"
                                },
                                {
                                    "Heading": "Distributed File System",
                                    "Description": "Architecture, Process, Communication, Naming, Synchronization, Fault tolerance and Security, Introduction to Software Product Line engineering"
                                },
                                {
                                    "Heading": "Aspect Oriented Architecture",
                                    "Description": "Introduction to Aspect-Oriented Programming, Aspect oriented architecture, Aspect oriented Modelling using UML, Aspect Oriented Modelling tools"
                                },
                                {
                                    "Heading": "Model-Driven Architecture",
                                    "Description": "What is MDA, Why MDA, State of the Art Practices and Tools, Scaling a software architecture and design"
                                }]
                            }
                        },
                        { "SubjectName": "SE 213 (lab) : Software Architecture and Design", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "NEM 481 : Computer Networking", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Internetworking Basics",
                                    "Description": "Overview of Internetworking Models, OSI Reference Model, Ethernet Networking, Data Encapsulation, Cisco Three-Layer Hierarchical Model"
                                },
                                {
                                    "Heading": "Introduction to TCP/IP",
                                    "Description": "TCP/IP and the DoD Model, IP Addressing, Broadcast Addresses"
                                },
                                {
                                    "Heading": "Subnetting and VLSMs",
                                    "Description": "Subnetting Basics, Variable Length Subnet Masks (VLSMs), Summarization, Troubleshooting IP Addressing"
                                },
                                {
                                    "Heading": "Cisco IOS and SDM",
                                    "Description": "IOS User Interface, Command-Line Interface (CLI), Router and Switch Configurations, Saving and Erasing Configurations, Cisco Security Device Manager (SDM)"
                                },
                                {
                                    "Heading": "Managing a Cisco Internetwork",
                                    "Description": "Cisco Router Internal Components, Router Boot Sequence, Configuration Register Management, Backing Up and Restoring IOS and Configuration, Cisco Discovery Protocol (CDP), Telnet Usage, Hostname Resolution, Network Troubleshooting"
                                },
                                {
                                    "Heading": "IP Routing Basics",
                                    "Description": "Routing Process Overview, Configuring IP Routing, Dynamic Routing Concepts, Distance-Vector Routing Protocols (RIP), Interior Gateway Routing Protocol (IGRP), Configuration Verification"
                                },
                                {
                                    "Heading": "Enhanced IGRP (EIGRP) and OSPF",
                                    "Description": "EIGRP Features and Operation, Configuration for Large Networks, Load Balancing with EIGRP, OSPF Basics, Configuration, DR/BDR Elections, OSPF and Loopback Interfaces, Troubleshooting"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Layer 2 Switching and STP",
                                    "Description": "Switching Services Overview, Spanning Tree Protocol (STP), Catalyst Switch Configuration, Cisco Network Assistant (CNA)"
                                },
                                {
                                    "Heading": "Virtual LANs (VLANs)",
                                    "Description": "VLAN Basics, VLAN Memberships, VLAN Identification, VLAN Trunking Protocol (VTP), Inter-VLAN Routing Configuration, Voice VLAN Configuration using CNA"
                                },
                                {
                                    "Heading": "Network Security",
                                    "Description": "Perimeter, Firewall, Internal Routers, Security Threat Recognition, Mitigation Strategies, Introduction to Access Lists (Standard, Extended, Advanced), Access List Monitoring, Configuration using SDM"
                                },
                                {
                                    "Heading": "Network Address Translation (NAT)",
                                    "Description": "NAT Overview, Types, NAT Operation, NAT Testing and Troubleshooting, NAT Configuration on Internetwork, Configuration using SDM"
                                },
                                {
                                    "Heading": "Cisco Wireless Technologies",
                                    "Description": "Introduction to Wireless Technology, Cisco Unified Wireless Solution, Wireless Internetwork Configuration"
                                },
                                {
                                    "Heading": "Internet Protocol Version 6 (IPv6)",
                                    "Description": "IPv6 Necessity and Benefits, Addressing, Operation in Internetworks, IPv6 Routing Protocols, Migration Strategies, IPv6 Configuration"
                                },
                                {
                                    "Heading": "Wide Area Networks",
                                    "Description": "Overview of Wide Area Networks, Cable and DSL Technologies, Serial WAN Cabling, High-Level Data-Link Control (HDLC), Point-to-Point Protocol (PPP), Frame Relay, SDM for WAN Configuration, Virtual Private Networks (VPNs). Case study on WAN connections"
                                }]
                            }
                        },
                        { "SubjectName": "NEM 481 (lab) : Computer Networking", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "CSE 219 : Industrial Revolutions and Emerging Technologies", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Industrial Evolutional Process",
                                    "Description": "IR 1.0, IR 2.0, IR 3.0, IR 4.0, IR 5.0"
                                },
                                {
                                    "Heading": "Artificial Intelligence and Machine Learning",
                                    "Description": "Fundamental concepts, algorithms, and applications of AI and ML"
                                },
                                {
                                    "Heading": "Human-centered AI, Robotic Process Automation (RPA)",
                                    "Description": "AI designed for human interaction, automation of repetitive tasks using RPA"
                                },
                                {
                                    "Heading": "Extended Reality",
                                    "Description": "Virtual Reality, Augmented Reality, Mixed Reality and their applications"
                                },
                                {
                                    "Heading": "Big Data Analytics",
                                    "Description": "Techniques and tools for processing and analyzing large datasets"
                                },
                                {
                                    "Heading": "3D Printing",
                                    "Description": "Principles, technologies, and applications of additive manufacturing"
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Genomics",
                                    "Description": "Study of genomes, sequencing technologies, and their impact on healthcare and biotechnology"
                                },
                                {
                                    "Heading": "Edge Computing",
                                    "Description": "Processing data closer to the source, reducing latency and bandwidth usage"
                                },
                                {
                                    "Heading": "Quantum Computing",
                                    "Description": "Principles of quantum mechanics in computing, potential applications"
                                },
                                {
                                    "Heading": "Blockchain",
                                    "Description": "Distributed ledger technology, applications in finance, supply chain, and beyond"
                                },
                                {
                                    "Heading": "Internet of Things (IoT)",
                                    "Description": "Network of interconnected devices, IoT architectures, and applications"
                                },
                                {
                                    "Heading": "Cyber Security",
                                    "Description": "Protecting systems and data from cyber threats, security frameworks and practices"
                                },
                                {
                                    "Heading": "5G network and beyond",
                                    "Description": "Next-generation network technologies, their capabilities, and future trends"
                                }]
                            }
                        }
                    ]
                }
            ]
        },
        {
            "LevelName": "Level 3",
            "Terms": [
                {
                    "TermName": "Term 1",
                    "Subjects": [
                        {
                            "SubjectName": "SE 300 : Capstone Project", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Supervisor and Topic Selection",
                                    "Description": "Application for Capstone Project Supervisor Selection, Topic and Supervisor selection, to be completed before the start of the 5th semester."
                                },
                                {
                                    "Heading": "Introduction and Briefing",
                                    "Description": "Introduction to the Capstone Project, including objectives and expectations, conducted in Week 1."
                                },
                                {
                                    "Heading": "Team Formation and Project Area Selection",
                                    "Description": "Formation of project teams and selection of project area, conducted in Week 2."
                                },
                                {
                                    "Heading": "Conduct Investigation/Literature Review",
                                    "Description": "Conducting a literature review on the selected topic to establish the project's foundation."
                                },
                                {
                                    "Heading": "Set Project Plan and Strategy",
                                    "Description": "Developing a project plan and strategy, including timelines and deliverables."
                                },
                                {
                                    "Heading": "Preparation of Project Proposal",
                                    "Description": "Drafting the project proposal outlining the scope, objectives, and methodology."
                                },
                                {
                                    "Heading": "Proposal Submission and Pre-Viva",
                                    "Description": "Submission of the project proposal and pre-viva evaluation by the supervisor (5% of marks, evaluated by Supervisor)."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Review and Correction of Proposal",
                                    "Description": "Reviewing feedback and making corrections to the project proposal."
                                },
                                {
                                    "Heading": "Document Preparation",
                                    "Description": "Preparing project documentation, including progress reports and other required materials."
                                },
                                {
                                    "Heading": "Submission of Progress Report and Presentation",
                                    "Description": "Submission of progress report (10% of marks, evaluated by Supervisor and Defense Board) and progress presentation (5% of marks, evaluated by Supervisor and Defense Board). Continuous Assessment (30% of marks, evaluated by Supervisor) and Log Book (5% of marks, evaluated by Supervisor) are also part of the evaluation."
                                }]
                            }
                        },
                        {
                            "SubjectName": "PROG 301 : Advanced Programming with Python and Scripting", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Python Structure",
                                    "Description": "Module, package, and scope. Control flow, loop, context manager, Object reference and recycling. Typing as type basic hinting."
                                },
                                {
                                    "Heading": "Functional Programming",
                                    "Description": "Function and lambdas. Comprehensions. Closure and decorators. Generators and coroutine. Map, filter, Commands and itertools."
                                },
                                {
                                    "Heading": "Object Oriented Programming",
                                    "Description": "Class and Object. Interface, Protocols and ABCs. Inheritance and advanced typing. Magic functions and operator overloading. Data class and pydantic."
                                },
                                {
                                    "Heading": "Handling Command Line Arguments",
                                    "Description": "Handling command line arguments with perverse. Introduction to logging, pipes, and signal. File and directory management. Introduction to os and sys module. Networking: Sockets and addresses. TCP, UDP. Introduction to Paho: MQTT and SSL."
                                },
                                {
                                    "Heading": "Threading and Multiprocessing",
                                    "Description": "Threading module, queue module, GIL in Python. Multiprocessing module, process pool, shared memory."
                                },
                                {
                                    "Heading": "Asynchronous Programming",
                                    "Description": "The asyncio module, event loop, coroutine, and task."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to NumPy",
                                    "Description": "Data Type, Arrays, Universal Functions, Aggregation, Broadcasting, Indexing."
                                },
                                {
                                    "Heading": "Introduction to Pandas",
                                    "Description": "Series, dataframe. Indexing (simple, hierarchical), selection. Join, merge, concat, append. Aggregation and grouping. Pivot table."
                                },
                                {
                                    "Heading": "Data Visualization using Matplotlib",
                                    "Description": "Line plot, scatter plot, density and contour plot, subplot, legend, test and annotation, 3D plotting."
                                },
                                {
                                    "Heading": "Machine Learning with Scikit-learn, TensorFlow",
                                    "Description": "Data representation in scikit-learn. Hyperparameters and model validation. TensorFlow basics, Keras APIs, and Tensorboard visualization."
                                },
                                {
                                    "Heading": "Web Scraping with Beautiful Soup",
                                    "Description": "Introduction to request and urllib module. Working with JSON."
                                },
                                {
                                    "Heading": "Web Development with FastAPI/Django",
                                    "Description": "Building web applications using FastAPI or Django frameworks."
                                }]
                            }
                        },
                        { "SubjectName": "PROG 301 (lab) : Advanced Programming with Python and Scripting", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SE 303 : Distributed Software Development", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Distributed Computing Architectures",
                                    "Description": "Overview of distributed computing architectures, paradigms, and Service-Oriented Architecture."
                                },
                                {
                                    "Heading": "Computing Paradigm and Software Design Patterns",
                                    "Description": "Study of computing paradigms and software design patterns, including Software Structural Patterns and Software Behavior Patterns."
                                },
                                {
                                    "Heading": "Programming in Concurrency Patterns and Multithreading",
                                    "Description": "Techniques for programming with concurrency patterns and multithreading in distributed systems."
                                },
                                {
                                    "Heading": "Performance under Multi-Core and Hyper-Threading Support",
                                    "Description": "Optimizing performance in distributed systems using multi-core and hyper-threading technologies."
                                },
                                {
                                    "Heading": "Service-Oriented Software Development",
                                    "Description": "Developing service-oriented software using WSDL, SOAP, Restful Services, Service Provider, and Service Broker."
                                },
                                {
                                    "Heading": "Service Hosting and Structural Patterns",
                                    "Description": "Service hosting, Service Client, and exercising Software Structural Patterns (Adapter, Façade, Composite, Decorator Design Patterns)."
                                }]
                            }, "FinalTerm": { "Syllabus": [] }
                        },
                        { "SubjectName": "SE 303 (lab) : Distributed Software Development", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SE 305 : Software Project Management", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Software Project Management",
                                    "Description": "Role and importance of project management in software development."
                                },
                                {
                                    "Heading": "Project Initiation and Feasibility Analysis",
                                    "Description": "Conducting feasibility studies and defining project scope."
                                },
                                {
                                    "Heading": "Project Planning: Scope, Schedule, and Resources",
                                    "Description": "Creating project plans, defining milestones, and allocating resources."
                                },
                                {
                                    "Heading": "Agile Methodologies: Scrum Basics",
                                    "Description": "Fundamentals of Scrum, roles (Product Owner, Scrum Master, Team)."
                                },
                                {
                                    "Heading": "Agile Methodologies: Sprint Planning and Execution",
                                    "Description": "Understanding sprint planning, daily stand-ups, and sprint reviews."
                                },
                                {
                                    "Heading": "Agile Methodologies: Kanban and Lean",
                                    "Description": "Exploring Kanban boards and lean principles in software projects."
                                },
                                {
                                    "Heading": "Risk Management in Software Projects",
                                    "Description": "Identifying, assessing, and managing risks throughout the project lifecycle."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Quality Assurance and Testing",
                                    "Description": "Implementing QA processes, testing strategies, and bug tracking."
                                },
                                {
                                    "Heading": "Project Monitoring and Control",
                                    "Description": "Monitoring project progress, tracking metrics, and adapting plans as needed."
                                },
                                {
                                    "Heading": "Stakeholder Management and Communication",
                                    "Description": "Effective communication with stakeholders and managing expectations."
                                },
                                {
                                    "Heading": "Project Closure and Post-Implementation Review",
                                    "Description": "Conducting project closure activities and lessons learned sessions."
                                },
                                {
                                    "Heading": "Software Metrics and Performance Measurement",
                                    "Description": "Measuring project performance and software metrics for continuous improvement."
                                },
                                {
                                    "Heading": "Emerging Trends in Software Project Management",
                                    "Description": "Exploring current trends like DevOps, AI in project management, etc."
                                },
                                {
                                    "Heading": "Final Project Presentations",
                                    "Description": "Presenting project outcomes, lessons learned, and future recommendations."
                                }]
                            }
                        },
                        {
                            "SubjectName": "SE 307 : Software Testing and Quality Assurance", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Software Quality and Quality Assurance Tasks",
                                    "Description": "Software quality, Elements of software quality assurance, SQA tasks, goals, and metrics, Software quality standards (ISO, IEEE, etc.), Software quality assurance throughout software life cycle, Testing vs. Software quality assurance."
                                },
                                {
                                    "Heading": "Testing Background",
                                    "Description": "Software testing: A bigger picture, Testing levels of Verification and Validation of Testing Strategies, Testing matrices, Testing throughout the software life cycle, Test case, Anatomy of a test case, Managing test cases."
                                },
                                {
                                    "Heading": "Functional Testing (Black-Box Testing)",
                                    "Description": "Equivalent partition, Boundary value analysis."
                                },
                                {
                                    "Heading": "Functional Testing (Black-Box Testing)",
                                    "Description": "Boundary value analysis, Use-case based testing."
                                },
                                {
                                    "Heading": "Bug Management",
                                    "Description": "Effective bug reporting, the bug workflow, Tracking bugs."
                                },
                                {
                                    "Heading": "Model-based Testing",
                                    "Description": "Testing with models, Finite state machine model testing."
                                },
                                {
                                    "Heading": "Structure Based Testing Techniques (White-Box Testing)",
                                    "Description": "Introduction, Path coverage and McCabe Cyclomatic complexity, Control structure coverage, Combinations of conditions."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Structure Based Testing Techniques (White-Box Testing)",
                                    "Description": "Data path testing, Automated unit testing and Test-driven development."
                                },
                                {
                                    "Heading": "Testing Object Oriented Applications",
                                    "Description": "Design of object-oriented applications and Testability, Test-cases and class hierarchy, use case-based test design, State based testing, Inter-class testing."
                                },
                                {
                                    "Heading": "Code Matrices and Testability of a Program",
                                    "Description": "Introduction, Refactoring and regression testing."
                                },
                                {
                                    "Heading": "Integration Testing",
                                    "Description": "Various approaches used for integration testing including, Incremental, Top-Down, Bottom Up, Smoke, Sandwich, and Regression testing."
                                },
                                {
                                    "Heading": "Testing Web Applications",
                                    "Description": "Quality dimensions of web applications, Errors within web application environments, User interface testing, Content Testing, Component testing, Performance Testing, Configuration testing."
                                },
                                {
                                    "Heading": "Testing SOA Applications",
                                    "Description": "Testing services, Deployment testing, Integration Testing, Model-based SOA application testing using pertinent modeling."
                                },
                                {
                                    "Heading": "Software Quality Control Beyond Testing",
                                    "Description": "Requirement Based Testing Techniques Validation: Alpha, Beta, and Acceptance testing Inspections, Reviews, and Walkthroughs, Defects prevention and process improvements, Comparison of quality assurance techniques."
                                }]
                            }
                        },
                        { "SubjectName": "SE 307 (lab) : Software Testing and Quality Assurance", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } }
                    ]
                },
                {
                    "TermName": "Term 2",
                    "Subjects": [
                        {
                            "SubjectName": "SE 300 : Capstone Project", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Finalize the Methodology",
                                    "Description": "Finalizing the project methodology, including research and development approaches, conducted in Weeks 1-2. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                },
                                {
                                    "Heading": "Development and Implementation of Project Prototype",
                                    "Description": "Developing and implementing the project prototype, conducted in Weeks 3-4. Continuous Assessment (30% of marks, evaluated by Supervisor) and Log Book (5% of marks, evaluated by Supervisor) are part of the evaluation."
                                },
                                {
                                    "Heading": "Field Work/Data Collection/Analysis/Software Development",
                                    "Description": "Conducting field work, data collection, analysis, and related software development, conducted in Weeks 5-8. Continuous Assessment (30% of marks, evaluated by Supervisor) and Log Book (5% of marks, evaluated by Supervisor) apply."
                                },
                                {
                                    "Heading": "Project Fine Tuning",
                                    "Description": "Fine-tuning the project based on initial results and feedback, conducted in Weeks 9-10. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                },
                                {
                                    "Heading": "Report Writing",
                                    "Description": "Writing the project report, documenting methodology, findings, and analysis, conducted in Weeks 1-10. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Submission of Draft Report and Pre-review",
                                    "Description": "Submission of the draft project report and pre-review by the supervisor, conducted in Week 11. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                },
                                {
                                    "Heading": "Submission of Final Report",
                                    "Description": "Submission of the final project report (10% of marks, evaluated by Supervisor and Defense Board), conducted in Week 12."
                                },
                                {
                                    "Heading": "Poster Presentation for Peer Review",
                                    "Description": "Poster presentation for peer review (5% of marks, based on Visitors' Feedback), conducted in Week 13."
                                },
                                {
                                    "Heading": "Final Defense and Demonstration",
                                    "Description": "Final defense and project demonstration (10% of marks, evaluated by Supervisor and Defense Board; Project itself is 20% of marks, evaluated by Supervisor and Defense Board), conducted in Week 14."
                                },
                                {
                                    "Heading": "Submission of Amended Final Report",
                                    "Description": "Submission of the amended final report, conducted within the first week after the final examination."
                                },
                                {
                                    "Heading": "Submission of Progress Report and Presentation",
                                    "Description": "Submission of progress report (10% of marks, evaluated by Supervisor and Defense Board) and progress presentation (5% of marks, evaluated by Supervisor and Defense Board), conducted in Week 14."
                                }]
                            }
                        },
                        {
                            "SubjectName": "CC 483 : Cloud Computing", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Background of Cloud Computing",
                                    "Description": "Distributed systems, issues in distributed systems, Basic Computing Paradigms."
                                },
                                {
                                    "Heading": "Introduction to Cloud Computing",
                                    "Description": "Definition and applications including benefits, challenges, and risks, historical overview, Enabling Technologies and System Models for Cloud Computing."
                                },
                                {
                                    "Heading": "Cloud Computing Architecture and Management",
                                    "Description": "Architectural design of Cloud computing, cloud service models (IaaS, PaaS, SaaS, XaaS)."
                                },
                                {
                                    "Heading": "Cloud Computing Architecture and Management",
                                    "Description": "Types of clouds (Public, Private, Hybrid, Community clouds)."
                                },
                                {
                                    "Heading": "Cloud Resource Virtualization",
                                    "Description": "Resource virtualization and virtual machine, file virtualization, types of virtualization, hardware/software support."
                                },
                                {
                                    "Heading": "Cloud Resource Virtualization",
                                    "Description": "Network virtualization, performance of virtual machines, VM software and platforms, hypervisors, OS-level virtualization, Docker."
                                },
                                {
                                    "Heading": "Cloud Resource Management and Scheduling",
                                    "Description": "Cloud Computing Reference Architecture, policies and mechanisms, resource utilization and energy efficiency."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Cloud Resource Management and Scheduling",
                                    "Description": "Application resource management, models for cloud-based web services, scheduling algorithms."
                                },
                                {
                                    "Heading": "Cloud Storage",
                                    "Description": "Overview of storage systems and models, Distributed File Systems, Cloud Databases, Data storage for online transaction processing systems."
                                },
                                {
                                    "Heading": "Cloud Security",
                                    "Description": "Cloud-security risks, Privacy and trust on the cloud, Cloud data encryption, Security of cloud infrastructure."
                                },
                                {
                                    "Heading": "Cloud Platforms",
                                    "Description": "Amazon AWS, Microsoft Azure, Google App Engine, Google MapReduce, Yahoo Hadoop, Eucalyptus, Nimbus, OpenStack, etc."
                                },
                                {
                                    "Heading": "Mobile Cloud Computing",
                                    "Description": "Architecture and applications of MCC, Code partitioning, Code offloading, VM migration techniques."
                                },
                                {
                                    "Heading": "Emergent Trends and Practices",
                                    "Description": "Hybrid Multicloud, Serverless Computing, Microservices, Virtual Desktop Infrastructure, Desktop as a Service."
                                },
                                {
                                    "Heading": "Emergent Trends and Practices",
                                    "Description": "Future Cloud Computing Architectures, Edge computing, Fog Computing."
                                }]
                            }
                        },
                        { "SubjectName": "CC 483 (lab) : Cloud Computing", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "SE 319 : Software Maintenance", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Software Maintenance",
                                    "Description": "Overview of software maintenance, Importance and significance, Types of maintenance: corrective, adaptive, perfective, preventive."
                                },
                                {
                                    "Heading": "Software Maintenance Process",
                                    "Description": "Software maintenance lifecycle, Maintenance activities and phases, Role of maintenance in the overall software development process."
                                },
                                {
                                    "Heading": "Tools and Techniques for Software Maintenance",
                                    "Description": "Introduction to version control systems, Using issue tracking systems, Automated testing frameworks."
                                },
                                {
                                    "Heading": "Prioritizing Maintenance Tasks",
                                    "Description": "Techniques for prioritization (e.g., Impact vs. Effort matrix), Factors influencing task prioritization, Case studies and exercises on task prioritization."
                                },
                                {
                                    "Heading": "Debugging Techniques",
                                    "Description": "Introduction to debugging, Debugging tools and methodologies, Debugging exercises and best practices."
                                },
                                {
                                    "Heading": "Code Refactoring",
                                    "Description": "Understanding code refactoring, Impact of refactoring on software maintenance."
                                },
                                {
                                    "Heading": "Code Refactoring and Optimization",
                                    "Description": "Techniques for code optimization, Impact of refactoring on software maintenance."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Managing Software Dependencies",
                                    "Description": "Identifying and managing external dependencies, Techniques for handling dependency issues, Case studies on dependency management."
                                },
                                {
                                    "Heading": "Documentation and Communication",
                                    "Description": "Importance of documentation in maintenance, Types of maintenance documentation, Effective communication within maintenance teams."
                                },
                                {
                                    "Heading": "Software Evolution and Legacy Systems",
                                    "Description": "Understanding software evolution, Challenges and strategies for maintaining legacy systems, Modernizing and migrating legacy systems."
                                },
                                {
                                    "Heading": "Security and Ethical Considerations",
                                    "Description": "Security vulnerabilities in maintenance, Ethical responsibilities of software maintainers, Ensuring data privacy and integrity maintenance activities."
                                },
                                {
                                    "Heading": "Software Maintenance Metrics",
                                    "Description": "Key performance indicators (KPIs) for maintenance, Metrics for measuring maintenance effectiveness, Using metrics to improve maintenance processes."
                                },
                                {
                                    "Heading": "Continuous Integration and Deployment",
                                    "Description": "Introduction to CI/CD pipelines, Automating deployment processes, Integration of maintenance into CI/CD workflows."
                                },
                                {
                                    "Heading": "Final Project and Review",
                                    "Description": "Students work on a final project applying concepts learned throughout the course, Presentation of final projects."
                                }]
                            }
                        },
                        {
                            "SubjectName": "SE 315 : Secure Software Development", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Secure Software Development and Software Security Principles",
                                    "Description": "Overview of Secure Software Development principles and practices, Understanding the importance of security in software development, Introduction to Software Security Principles and their significance in building resilient applications."
                                },
                                {
                                    "Heading": "Secure Coding Fundamentals and Software Assessment Methods",
                                    "Description": "Deep dive into secure coding practices, Understanding Software Assessment Methods and Techniques for identifying vulnerabilities, Hands-on exercises to implement secure coding practices and conduct basic software assessments."
                                },
                                {
                                    "Heading": "Data Validation Techniques and Vulnerability Classification",
                                    "Description": "In-depth exploration of Data Validation techniques to prevent injection attacks (e.g., SQL injection, XSS), Hands-on exercises to implement input validation in web and mobile applications."
                                },
                                {
                                    "Heading": "Session Management and Exception Handling",
                                    "Description": "Best practices for secure session management to prevent session hijacking and fixation, Strategies for robust exception handling to prevent information leakage and denial of service attacks."
                                },
                                {
                                    "Heading": "Data Encryption and Cryptography, and Software Attack Surface",
                                    "Description": "Introduction to Data Encryption techniques and Cryptography for protecting sensitive data, Understanding Software Attack Surface and techniques to reduce attack surface area, Hands-on exercises to implement data encryption and assess software attack surface."
                                },
                                {
                                    "Heading": "Application Security Configuration",
                                    "Description": "Understanding secure configuration management of application web servers, middleware, and databases, Implementing secure configurations to mitigate common vulnerabilities (e.g., default credentials, misconfigurations)."
                                },
                                {
                                    "Heading": "Policy Requirements for Secure Development",
                                    "Description": "Reviewing policy-specific requirements necessary for implementing a secure development program within enterprise organizations, Understanding compliance standards such as PCI DSS, HIPAA, GDPR, etc."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Secure Software Design Principles",
                                    "Description": "Incorporating security in requirements engineering and design phases, Conducting risk analysis and threat modeling to identify potential security risks."
                                },
                                {
                                    "Heading": "Defensive Coding Techniques",
                                    "Description": "Exploring defensive coding techniques to mitigate common vulnerabilities (e.g., buffer overflows, insecure deserialization), Hands-on exercises to implement defensive coding practices in real-world scenarios."
                                },
                                {
                                    "Heading": "Penetration Testing and Vulnerability Assessment",
                                    "Description": "Introduction to penetration testing methodologies and tools, Conducting vulnerability assessments to identify and remediate security vulnerabilities in software applications."
                                },
                                {
                                    "Heading": "Fuzzing and Static Analysis",
                                    "Description": "Understanding fuzzing techniques for identifying software vulnerabilities through automated testing, Utilizing static analysis tools for identifying security flaws in source code."
                                },
                                {
                                    "Heading": "Security Assessment and Post-Deployment Security",
                                    "Description": "Conducting comprehensive security assessments to evaluate the security posture of software applications, Implementing post-deployment security measures such as security monitoring and incident response."
                                }]
                            }
                        },
                        { "SubjectName": "SE 315 (lab) : Secure Software Development", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "BIM 317 : Business Analytics and Decision Making", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Data Analysis and Decision-Making",
                                    "Description": "Introduction, Modeling and Models, A Seven-Step Modeling Process."
                                },
                                {
                                    "Heading": "Exploring Data",
                                    "Description": "Describing the Distribution of a Single Variable, Populations and Samples, Data Sets, Variables, and Observations, Types of Data, Descriptive Measures for Categorical Variables and Numerical Variables, Time Series Data, Outliers and Missing Values, Excel Tables for Filtering, Sorting, and Summarizing."
                                },
                                {
                                    "Heading": "Finding Relationships among Variables",
                                    "Description": "Relationships among Categorical Variables, Stacked and Unstacked Formats, Relationships among Numerical Variables, Scatterplots, Correlation and Covariance, Pivot Tables."
                                },
                                {
                                    "Heading": "Probability and Probability Distribution",
                                    "Description": "Probability essentials, Probability Distribution of a Single Random Variable, Introduction to Simulation, The Normal Distribution, Applications of the Normal Distribution, The Binomial Distribution, Applications of the Binomial Distribution, The Poisson and Exponential Distribution."
                                },
                                {
                                    "Heading": "Decision-Making Under Uncertainty",
                                    "Description": "Elements of Decision Analysis, The Precision Tree Add-In, Bayes' Rule, Multistage Decision Problems and the Value of Information, Risk Aversion and Expected Utility."
                                },
                                {
                                    "Heading": "Statistical Inference",
                                    "Description": "Sampling and Sampling Distributions, Sampling Terminology, Methods for Selecting Random Samples, Introduction to Estimation, Sampling Distributions, Confidence Interval for a Mean, Total, Proportion and Standard Deviation, Confidence Interval for the Difference Between Means and Proportions, Sample Size Selection."
                                },
                                {
                                    "Heading": "Hypothesis Testing",
                                    "Description": "Concepts in Hypothesis Testing, Types of Errors, Significance Level and Rejection Region, Hypothesis Tests and Confidence Intervals, Hypothesis Tests for Other Parameters, Tests for Normality, Chi-Square Test for Independence."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Case Studies and Practical Implementations",
                                    "Description": "Case studies of Decision Making Using Decision Support Systems, Hands-on Exercises with Excel data management tools, Potential Applications of Decision Tools including RISK, StatTools, Precision Tree, etc., Practical Implementation of Data Mining and Data Management Software Tools Like SPSS, Strata, etc."
                                }]
                            }
                        },
                        { "SubjectName": "BIM 317 (lab) : Business Analytics and Decision Making", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } }
                    ]
                }
            ]
        },
        {
            "LevelName": "Level 4",
            "Terms": [
                {
                    "TermName": "Term 1",
                    "Subjects": [
                        {
                            "SubjectName": "SE 400 : Undergraduate Thesis", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Supervisor and Topic Selection",
                                    "Description": "Application for Thesis Supervisor Selection and Topic and Supervisor selection, to be completed before the start of the 7th semester."
                                },
                                {
                                    "Heading": "Introduction and Briefing",
                                    "Description": "Introduction to the Undergraduate Thesis, including objectives and expectations, conducted in Week 1."
                                },
                                {
                                    "Heading": "Team Formation and Project Area Selection",
                                    "Description": "Formation of project teams and selection of project area, conducted in Week 2."
                                },
                                {
                                    "Heading": "Conduct Investigation/Literature Review",
                                    "Description": "Conducting a literature review on the selected topic to establish the thesis foundation, conducted in Weeks 6-8."
                                },
                                {
                                    "Heading": "Set Project Plan and Strategy",
                                    "Description": "Developing a project plan and strategy, including timelines and deliverables, conducted in Weeks 9-10."
                                },
                                {
                                    "Heading": "Preparation of Project Proposal",
                                    "Description": "Drafting the thesis proposal outlining the scope, objectives, and methodology, conducted in Week 11."
                                },
                                {
                                    "Heading": "Proposal Submission and Pre-Viva",
                                    "Description": "Submission of the thesis proposal and pre-viva evaluation by the supervisor (5% of marks, evaluated by Supervisor), conducted in Week 12."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Review and Correction of Proposal",
                                    "Description": "Reviewing feedback and making corrections to the thesis proposal, conducted in Week 13."
                                },
                                {
                                    "Heading": "Document Preparation",
                                    "Description": "Preparing thesis documentation, including progress reports and other required materials, conducted in Week 14."
                                },
                                {
                                    "Heading": "Submission of Progress Report and Presentation",
                                    "Description": "Submission of progress report (10% of marks, evaluated by Supervisor) and progress presentation (5% of marks, evaluated by Supervisor and Defense Board). Continuous Assessment (30% of marks, evaluated by Supervisor) and Log Book (5% of marks, evaluated by Supervisor) are also part of the evaluation, conducted in Week 14."
                                }]
                            }
                        },
                        {
                            "SubjectName": "AI 483 : Artificial Intelligence and Machine Learning", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Intelligent Agents and their Environments",
                                    "Description": "The concept of a Rational Agent, Specifying the Task environment (PEAS description), Different characteristics of environments (Fully vs Partially observable, Static vs Dynamic, Episodic vs Sequential, etc.) and Different types of agents (Reflex, Goal-based, Utility-based, etc.)."
                                },
                                {
                                    "Heading": "Adversarial Search",
                                    "Description": "Formulation of a Game tree, The minimax algorithm, Alpha-Beta pruning."
                                },
                                {
                                    "Heading": "Probabilistic Reasoning",
                                    "Description": "Bayes' rule and its uses, Bayesian Network: Building a Bayes-net and making inference from it, Hidden Markov Model."
                                },
                                {
                                    "Heading": "Introduction to Machine Learning Concepts",
                                    "Description": "Machine learning strategy - Supervised, Unsupervised, Semi-supervised, and Reinforcement Learning, Parametric and Non-parametric models, Maximum likelihood estimation."
                                },
                                {
                                    "Heading": "Introduction to Machine Learning Concepts",
                                    "Description": "Gradient Descent and types, Cost Functions, Regularization, Normalization and Optimization, Bias-Variance Tradeoff, Overfitting & Underfitting, Many-fold learning."
                                },
                                {
                                    "Heading": "Introductory Machine Learning Models",
                                    "Description": "Linear Regression and Inference, Logistic Regression."
                                },
                                {
                                    "Heading": "Introductory Machine Learning Models",
                                    "Description": "Latent Discriminant Analysis, Decision Tree & Random Forest."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Introductory Machine Learning Models",
                                    "Description": "K-means clustering, Agglomerative Clustering."
                                },
                                {
                                    "Heading": "Deep Learning",
                                    "Description": "Multilayer perceptron - XOR problem, Activation Functions, Back-propagation, Connecting neuro-biology. Neural Network for Structured Data: Artificial Feed-Forward Neural Network, vanishing and exploding gradients, catastrophic forgetting, residual connection, early stopping, weight decay, dropout."
                                },
                                {
                                    "Heading": "Neural Network for Images Data",
                                    "Description": "Common Layers - Convolutional layers, Pooling layers. Typical architecture - VGG-16, ResNet, InceptionNet, GAN. Application in Real Life: Object detection, Image Tagging, Segmentation."
                                },
                                {
                                    "Heading": "Neural Network for Sequence Data",
                                    "Description": "Recurrent Neural Network - Backpropagation through time, Gating and long-term memory, Attention Mechanism. Typical Architectures - LSTM, GRU, Transformer."
                                },
                                {
                                    "Heading": "Dimensionality Reduction",
                                    "Description": "Curse of Dimension, PCA, t-sne, Embedding mechanism concept."
                                },
                                {
                                    "Heading": "Advanced Concepts",
                                    "Description": "Bagging, Boosting, Ensemble Learning, Data imbalance problem."
                                },
                                {
                                    "Heading": "Advanced Concepts",
                                    "Description": "Machine Learning in Graph, KL divergence, Feature selection, Few-shot and n-shot learning, Meta-learning, Transfer-learning, Feature Engineering Concepts, Project."
                                }]
                            }
                        },
                        { "SubjectName": "AI 483 (lab) : Artificial Intelligence and Machine Learning", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        { "SubjectName": "Option I", "MidTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] }, "FinalTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] } },
                        { "SubjectName": "Option I (lab)", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        { "SubjectName": "Option II", "MidTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] }, "FinalTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] } },
                        { "SubjectName": "Option II (lab)", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "ENG 407 : Technical and Academic Writing", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Technical Reporting",
                                    "Description": "Technical writing procedures and proposals, strategic plans and plannings."
                                },
                                {
                                    "Heading": "Publishing Works",
                                    "Description": "Type of works should be published and why to publish certain chosen work, open access publishing and self-publishing."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Rules for E-media",
                                    "Description": "E-mail, E-newsletter, blogging, E-magazines."
                                },
                                {
                                    "Heading": "Writing with Collaborators",
                                    "Description": "Writing in different voices, Collaborative writing projects."
                                },
                                {
                                    "Heading": "Introduction of Academic Writing",
                                    "Description": "Basics of Academic Writing, Characteristics of Good Academic Writing, Academic Writing Process."
                                },
                                {
                                    "Heading": "Titles and Headings",
                                    "Description": "Heading and Title, Academic Languages."
                                },
                                {
                                    "Heading": "Types of Academic Writings I",
                                    "Description": "LAB Report Writing, Research Paper Writing."
                                },
                                {
                                    "Heading": "Types of Academic Writings II",
                                    "Description": "Research Proposal, Literature Review."
                                },
                                {
                                    "Heading": "Types of Academic Writings III",
                                    "Description": "Thesis, Dissertation."
                                }]
                            }
                        },
                        { "SubjectName": "ENG 407 (lab) : Technical and Academic Writing", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } }
                    ]
                },
                {
                    "TermName": "Term 2",
                    "Subjects": [
                        {
                            "SubjectName": "SE 400 : Undergraduate Thesis", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Finalize the Methodology",
                                    "Description": "Finalizing the thesis methodology, including research and development approaches, conducted in Weeks 1-2. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                },
                                {
                                    "Heading": "Development and Implementation of Project Prototype",
                                    "Description": "Developing and implementing the thesis prototype, conducted in Weeks 3-4. Continuous Assessment (30% of marks, evaluated by Supervisor) and Log Book (5% of marks, evaluated by Supervisor) are part of the evaluation."
                                },
                                {
                                    "Heading": "Field Work/Data Collection/Analysis/Related Software Development",
                                    "Description": "Conducting field work, data collection, analysis, and related software development, conducted in Weeks 5-8. Continuous Assessment (30% of marks, evaluated by Supervisor) and Log Book (5% of marks, evaluated by Supervisor) apply."
                                },
                                {
                                    "Heading": "Project Fine Tuning",
                                    "Description": "Fine-tuning the thesis project based on initial results and feedback, conducted in Weeks 9-10. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                },
                                {
                                    "Heading": "Report Writing",
                                    "Description": "Writing the thesis report, documenting methodology, findings, and analysis, conducted in Weeks 1-10. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Submission of Draft Report and Pre-review",
                                    "Description": "Submission of the draft thesis report and pre-review by the supervisor, conducted in Week 11. Continuous Assessment (30% of marks, evaluated by Supervisor) applies."
                                },
                                {
                                    "Heading": "Submission of Final Report",
                                    "Description": "Submission of the final thesis report (10% of marks, evaluated by Supervisor and Defense Board), conducted in Week 12."
                                },
                                {
                                    "Heading": "Poster Presentation for Peer Review",
                                    "Description": "Poster presentation for peer review (5% of marks, based on Visitors' Feedback), conducted in Week 13."
                                },
                                {
                                    "Heading": "Final Defense and Demonstration",
                                    "Description": "Final defense and thesis demonstration (10% of marks, evaluated by Supervisor and Defense Board; Project itself is 20% of marks, evaluated by Supervisor and Defense Board), conducted in Week 14."
                                },
                                {
                                    "Heading": "Submission of Amended Final Report",
                                    "Description": "Submission of the amended final thesis report, conducted within the first week after the final examination."
                                },
                                {
                                    "Heading": "Submission of Progress Report and Presentation",
                                    "Description": "Submission of progress report (10% of marks, evaluated by Supervisor) and progress presentation (5% of marks, evaluated by Supervisor and Defense Board), conducted in Week 14."
                                }]
                            }
                        },
                        {
                            "SubjectName": "SE 411 : Software Professionalism and Ethics", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Introduction to Ethics",
                                    "Description": "Morals and ethics, Comparison of ethics and engineering ethics, Ethics at personal and student level."
                                },
                                {
                                    "Heading": "The Concept of Professions",
                                    "Description": "The importance of ethics in science and engineering, The role of codes of ethics, Professional responsibilities of software engineers."
                                },
                                {
                                    "Heading": "The Concept of Morality",
                                    "Description": "The importance of core values, Moral/ethical dilemmas and hierarchy of moral values, Factors affecting moral responsibility, and degrees of responsibility."
                                },
                                {
                                    "Heading": "Overview of Ethical Theories and Applications",
                                    "Description": "Overview of ethical theories and their applications in software engineering."
                                },
                                {
                                    "Heading": "Basics of Ethical Analyses and Decision-Making",
                                    "Description": "Fundamentals of ethical analyses and decision-making processes in professional settings."
                                },
                                {
                                    "Heading": "The Importance of Intention",
                                    "Description": "Truth (personal and social), The concept of whistleblowing, Ethical leadership in engineering and society, Conflicts of interests."
                                },
                                {
                                    "Heading": "Engineering Ethics in Organizations",
                                    "Description": "Ethics in the workplace, Fairness (personal and social)."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Case Studies on Ethics for Software Engineers",
                                    "Description": "Analyzing real-world case studies to understand ethical challenges and decision-making in software engineering."
                                },
                                {
                                    "Heading": "Ethical Issues Related to Software Requirements",
                                    "Description": "Exploring ethical considerations in gathering and defining software requirements."
                                },
                                {
                                    "Heading": "Ethical Issues Related to Software Design",
                                    "Description": "Examining ethical implications in software design decisions and their impact on users and society."
                                },
                                {
                                    "Heading": "Ethical Issues Related to Software Testing",
                                    "Description": "Understanding ethical responsibilities in ensuring software quality and reliability through testing."
                                },
                                {
                                    "Heading": "Ethical Issues Related to Software Maintenance",
                                    "Description": "Addressing ethical challenges in maintaining and updating software systems."
                                },
                                {
                                    "Heading": "Ethical Issues Related to Software Project Management",
                                    "Description": "Exploring ethical considerations in managing software projects, including resource allocation and stakeholder communication."
                                }]
                            }
                        },
                        { "SubjectName": "Option I", "MidTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] }, "FinalTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] } },
                        { "SubjectName": "Option I (lab)", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        { "SubjectName": "Option II", "MidTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] }, "FinalTerm": { "Syllabus": [{ "Heading": "Optional Subject", "Description": " ~ The choice was made by the student himself." }] } },
                        { "SubjectName": "Option II (lab)", "MidTerm": { "Syllabus": [] }, "FinalTerm": { "Syllabus": [] } },
                        {
                            "SubjectName": "BIM 417 : Business Strategies and Entrepreneur", "MidTerm": {
                                "Syllabus": [{
                                    "Heading": "Strategy Formulation",
                                    "Description": "Strategy Formulation, Strategy Execution, Organizational Structure."
                                },
                                {
                                    "Heading": "Concept of Communication",
                                    "Description": "Basic types of communication, Techniques of effective communication, Barriers of communication."
                                }]
                            }, "FinalTerm": {
                                "Syllabus": [{
                                    "Heading": "Leadership and Team Building",
                                    "Description": "Leadership concept, types, attributes of a successful leader, team-building concept, salient features of a team, and basic stages of team building."
                                },
                                {
                                    "Heading": "Critical Thinking and Decision Making",
                                    "Description": "Critical thinking, convergent thinking, divergent thinking, problem identifying, Managerial decision making."
                                },
                                {
                                    "Heading": "Sustainable Business Plan",
                                    "Description": "Sustainable business plan, business models for sustainable development."
                                },
                                {
                                    "Heading": "Developing a Business Proposal",
                                    "Description": "Concept of business proposal, methods of business proposal, Industry and Market Research."
                                },
                                {
                                    "Heading": "Human Resource Management",
                                    "Description": "Basic elements of HRM."
                                },
                                {
                                    "Heading": "Manpower Planning and Regulatory Law",
                                    "Description": "Manpower planning, recruitment, training and development, remuneration and benefits, regulatory law."
                                },
                                {
                                    "Heading": "Recap and Course Completion",
                                    "Description": "Recap and course completion session."
                                }]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};



// Function to toggle visibility of content
function toggleContent(element) {
    const content = element.parentElement.nextElementSibling;
    content.classList.toggle('open');
}

// Function to toggle children (expand/collapse all children recursively)
function toggleChildren(button) {
    const content = button.closest('.level, .term, .subject, .exam').querySelector('.content');
    const isExpanded = button.textContent === 'Collapse';

    if (isExpanded) {
        // Collapse all children recursively
        content.querySelectorAll('.content').forEach(child => {
            child.classList.remove('open');
        });
        button.textContent = 'Expand';
    } else {
        // Expand children recursively
        content.classList.add('open'); // Ensure the parent content is open
        content.querySelectorAll('.content').forEach(child => {
            child.classList.add('open');
        });
        button.textContent = 'Collapse';
    }
}

// Function to expand sections
function expandAll() {
    document.querySelectorAll('.content').forEach(content => {
        content.classList.add('open');
    });
    // Update all toggle buttons to "Collapse All"
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = 'Collapse';
    });
}

// Function to collapse all sections
function collapseAll() {
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('open');
    });
    // Update all toggle buttons to "Expand"
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = 'Expand';
    });
}

// Function to generate the HTML structure dynamically
function renderCourseOutline() {
    const container = document.getElementById('course-outline');
    courseData.Levels.forEach(level => {
        const hasChildren = level.Terms.length > 0;
        const levelDiv = document.createElement('div');
        levelDiv.classList.add('level');
        levelDiv.innerHTML = `
            <div class="title">
                <span class="title-text" onclick="toggleContent(this)">${level.LevelName}</span>
                ${hasChildren ? '<button class="toggle-btn" onclick="toggleChildren(this)">Expand</button>' : ''}
            </div>
            <div class="content">
                ${level.Terms.map(term => `
                    <div class="term">
                        <div class="title">
                            <span class="title-text" onclick="toggleContent(this)">${term.TermName}</span>
                            ${term.Subjects.length > 0 ? '<button class="toggle-btn" onclick="toggleChildren(this)">Expand</button>' : ''}
                        </div>
                        <div class="content">
                            ${term.Subjects.map(subject => `
                                <div class="subject">
                                    <div class="title">
                                        <span class="title-text" onclick="toggleContent(this)">${subject.SubjectName}</span>
                                        <button class="toggle-btn" onclick="toggleChildren(this)">Expand</button>
                                    </div>
                                    <div class="content">
                                        <div class="exam">
                                            <div class="title">
                                                <span class="title-text" onclick="toggleContent(this)">Mid Term</span>
                                                ${subject.MidTerm.Syllabus.length > 0 ? '<button class="toggle-btn" onclick="toggleChildren(this)">Expand</button>' : ''}
                                            </div>
                                            <div class="content">
                                                ${subject.MidTerm.Syllabus.length > 0 ? subject.MidTerm.Syllabus.map(syllabus => `
                                                    <div class="syllabus">
                                                        <strong>${syllabus.Heading}</strong>: ${syllabus.Description}
                                                    </div>
                                                `).join('') : '<div class="syllabus">The lab is a reflection of the Theory Course. Please check the corresponding Theory Course syllabus.</div>'}
                                            </div>
                                        </div>
                                        <div class="exam">
                                            <div class="title">
                                                <span class="title-text" onclick="toggleContent(this)">Final Term</span>
                                                ${subject.FinalTerm.Syllabus.length > 0 ? '<button class="toggle-btn" onclick="toggleChildren(this)">Expand</button>' : ''}
                                            </div>
                                            <div class="content">
                                                ${subject.FinalTerm.Syllabus.length > 0 ? subject.FinalTerm.Syllabus.map(syllabus => `
                                                    <div class="syllabus">
                                                        <strong>${syllabus.Heading}</strong>: ${syllabus.Description}
                                                    </div>
                                                `).join('') : '<div class="syllabus">The lab is a reflection of the Theory Course. Please check the corresponding Theory Course syllabus.</div>'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(levelDiv);
    });
}

// Render the course outline on page load
renderCourseOutline();

function toggleContentButton() {
    var content = document.getElementById("introduceSE");
    var button = document.getElementById("toggle-button-forShowandLess");

    if (content.classList.contains("expanded")) {
        content.classList.remove("expanded"); // Collapse the content
        button.innerHTML = "Show More"; // Change button text
    } else {
        content.classList.add("expanded"); // Expand the content
        button.innerHTML = "Show Less"; // Change button text
    }
}



function goToFAQ(faqId) {
    // Switch to the FAQ tab
    const faqTab = document.querySelector(".tab[data-tab='about']");
    if (faqTab) {
        faqTab.click(); // Simulate a click to switch to the FAQ tab
    }

    // Open the specific FAQ
    const faq = document.getElementById(faqId);

    faq.click();
    faq.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
        faq.style.transition = 'background-color 1s';
        faq.style.backgroundColor = '#9f4b1b'; // Highlight the FAQ for 1 second
        setTimeout(() => {
            faq.style.backgroundColor = ''; // Remove the highlight after 1 second
        }, 1000);
    }, 500);
}









(function () {
    // Default preset
    const defaultPreset = {
    id: 'default',
    name: 'BDU (default)',
    totalMarks: 100,
    credit: 1,
    marksPerCredit: 100,
    gradingTable: [
        { start: 80, end: 100, gpa: 4.00, grade: 'A+' },
        { start: 75, end: 79.99, gpa: 3.75, grade: 'A' },
        { start: 70, end: 74.99, gpa: 3.50, grade: 'A-' },
        { start: 65, end: 69.99, gpa: 3.25, grade: 'B+' },
        { start: 60, end: 64.99, gpa: 3.00, grade: 'B' },
        { start: 55, end: 59.99, gpa: 2.75, grade: 'B-' },
        { start: 50, end: 54.99, gpa: 2.50, grade: 'C+' },
        { start: 45, end: 49.99, gpa: 2.25, grade: 'C' },
        { start: 40, end: 44.99, gpa: 2.00, grade: 'D' },
        { start: 0, end: 39.99, gpa: 0.00, grade: 'F' }
    ]
};

    // Initialize presets from localStorage
    let presets = JSON.parse(localStorage.getItem('cgpaPresets')) || [];
    localStorage.setItem('cgpaPresets', JSON.stringify(presets));

    // Show preset modal
    function showPresetModal(preset = null) {
        const modal = document.getElementById('presetModal');
        modal.classList.remove('hidden');
        resetModalForm(preset);
    }

    // Hide preset modal
    function hidePresetModal() {
        const modal = document.getElementById('presetModal');
        modal.classList.add('hidden');
    }

    // Reset modal form
    function resetModalForm(preset) {
        const presetNameInput = document.getElementById('presetName');
        const totalMarksInput = document.getElementById('totalMarksInput');
        const creditInput = document.getElementById('creditInput');
        const marksPerCreditDisplay = document.getElementById('marksPerCreditDisplay');
        const modalTitle = document.querySelector('#presetModal h2');

        if (preset) {
            presetNameInput.value = preset.name;
            totalMarksInput.value = preset.totalMarks || '';
            creditInput.value = preset.credit || '';
            marksPerCreditDisplay.textContent = preset.marksPerCredit ? preset.marksPerCredit.toFixed(2) : 'N/A';
            renderGradingTable(preset.gradingTable);
            modalTitle.textContent = 'Edit Preset';
            presetNameInput.dataset.presetId = preset.id;
        } else {
            presetNameInput.value = '';
            totalMarksInput.value = '100';
            creditInput.value = '1';
            marksPerCreditDisplay.textContent = '100.00';
            renderGradingTable(defaultPreset.gradingTable);
            modalTitle.textContent = 'Create New Preset';
            delete presetNameInput.dataset.presetId;
        }

    }

    // Render grading table
    function renderGradingTable(gradingTable) {
        const tableBody = document.getElementById('presetGradingTableBody');
        tableBody.innerHTML = '';
        gradingTable.forEach((range, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="number" value="${range.start}" class="grading-start" min="0" max="100"></td>
                <td><input type="number" value="${range.end}" class="grading-end" min="0" max="100"></td>
                <td><input type="number" value="${range.gpa}" step="0.01" class="grading-gpa" min="0" max="4"></td>
                <td><input type="text" value="${range.grade || ''}" class="grading-grade"></td>
                <td><button class="remove-row" data-index="${index}">Del</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.remove-row').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                gradingTable.splice(index, 1);
                renderGradingTable(gradingTable);
            });
        });
    }

    // Add new grade range
    function addGradeRange() {
        const gradingTable = getCurrentGradingTable();
        gradingTable.push({ start: 0, end: 100, gpa: 4.00, grade: 'A+' });
        renderGradingTable(gradingTable);
    }

    // Get current grading table
    function getCurrentGradingTable() {
        const rows = document.querySelectorAll('#presetGradingTableBody tr');
        const gradingTable = [];
        rows.forEach(row => {
            const start = parseInt(row.querySelector('.grading-start').value);
            const end = parseInt(row.querySelector('.grading-end').value);
            const gpa = parseFloat(row.querySelector('.grading-gpa').value);
            const grade = row.querySelector('.grading-grade').value.trim();
            gradingTable.push({ start, end, gpa, grade });
        });
        // Sort by start in descending order
        gradingTable.sort((a, b) => b.start - a.start);
        return gradingTable;
    }

    // Validate grading table
    function validateGradingTable(gradingTable) {
        for (let i = 0; i < gradingTable.length; i++) {
            const range = gradingTable[i];
            if (isNaN(range.start) || isNaN(range.end) || isNaN(range.gpa)) {
                showToast('All fields must be valid numbers.', 'error');
                return false;
            }
            if (range.start > range.end) {
                showToast(`Invalid range: ${range.start}–${range.end} (Start cannot be greater than End).`, 'error');
                return false;
            }
            if (!range.grade) {
                showToast('Grade name is required for each range.', 'error');
                return false;
            }
        }
        return true;
    }

    // Calculate marks per credit
    function updateMarksPerCredit() {
        const totalMarks = parseFloat(document.getElementById('totalMarksInput').value);
        const credit = parseFloat(document.getElementById('creditInput').value);
        const marksPerCreditDisplay = document.getElementById('marksPerCreditDisplay');
        if (totalMarks && credit && credit > 0) {
            const marksPerCredit = totalMarks / credit;
            marksPerCreditDisplay.textContent = marksPerCredit.toFixed(2);
        } else {
            marksPerCreditDisplay.textContent = 'N/A';
        }
    }

    // Save preset
    function savePreset() {
        const presetNameInput = document.getElementById('presetName');
        const presetName = presetNameInput.value.trim();
        const totalMarks = parseFloat(document.getElementById('totalMarksInput').value) || null;
        const credit = parseFloat(document.getElementById('creditInput').value) || null;
        const gradingTable = getCurrentGradingTable();
        const presetId = presetNameInput.dataset.presetId;

        if (!presetName) {
            showToast('Preset name is required.', 'error');
            return;
        }

        if ((!totalMarks || !credit || credit <= 0)) {
            showToast('Total marks and credit are required for mark-based calculation.', 'error');
            return;
        }

        if (!validateGradingTable(gradingTable)) {
            return;
        }

        const preset = {
            id: presetId || crypto.randomUUID(),
            name: presetName,
            totalMarks,
            credit,
            marksPerCredit: totalMarks && credit ? totalMarks / credit : null,
            gradingTable
        };

        if (presetId) {
            const index = presets.findIndex(p => p.id === presetId);
            presets[index] = preset;
        } else {
            presets.push(preset);
        }

        localStorage.setItem('cgpaPresets', JSON.stringify(presets));
        updatePresetSelector();
        updatePresetList();
        hidePresetModal();
        showToast(`Preset ${presetName} ${presetId ? 'updated' : 'saved'} successfully!`, 'success');
    }

    // Delete preset
    function deletePreset(presetId) {
        const preset = presets.find(p => p.id === presetId);
        if (!preset) return;
        presets = presets.filter(p => p.id !== presetId);
        localStorage.setItem('cgpaPresets', JSON.stringify(presets));
        updatePresetSelector();
        updatePresetList();
        showToast(`Preset ${preset.name} deleted successfully!`, 'success');
    }

    // Update preset selector
    function updatePresetSelector() {
        const selector = document.getElementById('presetSelector');
        selector.innerHTML = '<option value="">BDU (default)</option>';
        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = preset.name;
            selector.appendChild(option);
        });
    }

    // Update preset list
    function updatePresetList() {
        const presetList = document.getElementById('presetList');
        presetList.innerHTML = presets.length ? '' : '<i style="text-align: center;">BDU is default preset Now. Click to add your own Preset</i>';
        presets.forEach(preset => {
            const div = document.createElement('div');
            div.classList.add('preset-item');
            div.innerHTML = `
                <span>${preset.name}</span>
                <div>
                    <button class="edit-preset" data-preset-id="${preset.id}">Edit</button>
                    <button class="delete-preset" data-preset-id="${preset.id}">Delete</button>
                </div>
            `;
            presetList.appendChild(div);
        });

        document.querySelectorAll('.edit-preset').forEach(button => {
            button.addEventListener('click', () => {
                const presetId = button.dataset.presetId;
                const preset = presets.find(p => p.id === presetId);
                showPresetModal(preset);
            });
        });

        document.querySelectorAll('.delete-preset').forEach(button => {
            button.addEventListener('click', () => {

                deletePreset(button.dataset.presetId);
            });
        });
    }

    // Calculate GPA
    window.calculateGPA = function (percentage, preset) {
        if (!preset || !preset.gradingTable || !Array.isArray(preset.gradingTable)) {
            showToast('Invalid preset grading table.', 'error');
            return { gp: 0, grade: 'F' };
        }

        for (const range of preset.gradingTable) {
            if (percentage >= range.start && percentage <= range.end) {
                return { gp: range.gpa, grade: range.grade };
            }
        }
        return { gp: 0, grade: 'F' };
    };

    // Expose default preset
    window.defaultPreset = defaultPreset;

    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
        const presetButton = document.getElementById('PresetButton');
        if (presetButton) {
            presetButton.addEventListener('click', () => showPresetModal());
        }

        const discardButton = document.getElementById('discardPreset');
        if (discardButton) {
            discardButton.addEventListener('click', hidePresetModal);
        }

        const applyButton = document.getElementById('applyPreset');
        if (applyButton) {
            applyButton.addEventListener('click', savePreset);
        }

        const addGradeButton = document.getElementById('addGradeRange');
        if (applyButton) {
            addGradeButton.addEventListener('click', addGradeRange);
        }

        const totalMarksInput = document.getElementById('totalMarksInput');
        const creditInput = document.getElementById('creditInput');
        if (totalMarksInput && creditInput) {
            totalMarksInput.addEventListener('input', updateMarksPerCredit);
            creditInput.addEventListener('input', updateMarksPerCredit);
        }


        updateMarksPerCredit();
        updatePresetSelector();
        updatePresetList();
    });
})();

