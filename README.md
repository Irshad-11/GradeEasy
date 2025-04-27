
# GradeEasy

## At a Glance
GradeEasy is a user-friendly web application designed to assist university students in calculating, tracking, and visualizing their Cumulative Grade Point Average (CGPA). Built with modern web technologies, it offers an intuitive interface, customizable grading systems, and insightful visualizations to monitor academic progress. The application is tailored for students at Bangladesh Digital University (BDU) but is adaptable to other institutions through customizable presets.

- **Purpose**: Calculate and track semester CGPA with ease.
- **Key Features**: CGPA calculator, progress tracking with D3.js visualizations, customizable grading presets, and detailed course outlines.
- **Target Audience**: University students, particularly those at BDU.
- **Deployment**: Hosted on GitHub Pages or accessible via a local server.
- **License**: MIT License.


## Features
- **CGPA Calculator**: Input course marks (Continuous Assessment, Midterm, Final) and credits to compute semester CGPA.
- **Progress Tracking**: Visualize CGPA trends across semesters using interactive D3.js line graphs.
- **Customizable Presets**: Create and manage grading systems to match institutional standards.
- **Course Outline**: Detailed syllabus viewer for BDU’s Software Engineering program.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Local Storage**: Save semester data locally for offline access.
- **Toast Notifications**: User-friendly feedback for actions like saving or errors.
- **FAQ and Support**: Comprehensive user manual and FAQ section for guidance.


## Usage
1. **Access the App**: Open GradeEasy in a browser via the hosted URL or locally.
2. **Navigate Tabs**:
   - **Introduction**: Learn about GradeEasy’s features.
   - **CG Calculate**: Input course details to calculate semester CGPA.
   - **Track CGPA**: View CGPA trends and detailed semester reports.
   - **Settings**: Customize grading presets.
   - **Dpt. SE, BDU**: Explore the Software Engineering curriculum.
   - **About GradeEasy**: Read FAQs and developer credits.
3. **Calculate CGPA**:
   - Enter semester name, select a preset, and add course details.
   - Click **Calculate** to view results.
   - Enable **Track this Semester** to save data for tracking.
4. **Track Progress**: View CGPA graphs and semester details in the **Track CGPA** tab.
5. **Customize Presets**: Add or edit grading systems in the **Settings** tab to match your institution’s standards.

For detailed instructions, refer to the [User Manual](UserManual.html).

## Project Structure
```plaintext
gradeeasy/
├── index.html          # Main entry point
├── UserManual.html     # User documentation
├── script.js           # Core JavaScript logic
├── styles.css          # Styling for the application
└── README.md           # Project documentation
 
```

## Technologies Used
- **HTML5**: Structure of the web application.
- **CSS3**: Styling with responsive design for mobile and desktop.
- **JavaScript (ES6)**: Core logic for CGPA calculations, UI interactions, and local storage.
- **D3.js**: Data visualization for CGPA trends.
- **MathJax**: Rendering mathematical formulas in FAQs.
- **LocalStorage**: Persistent storage for semester data and presets.
- **Google Fonts**: Typography for enhanced readability.
- **GitHub Pages**: Hosting for deployment.

## Contact
- **Developer**: Irshad Hossain
- **Email**: [Mail](mailto:irshadrisad@gmail.com)

For enquiry, refer to the **Reach Us** section in the application or open an issue on GitHub.

---

**GradeEasy**: Empowering students to track their academic journey with ease. 🚀
