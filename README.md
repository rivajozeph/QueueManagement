# QURE — Hospital Queue Management System

**Organizing Queues, Prioritizing Care**

QURE is a hospital queue management demo that combines a browser-based interface with a standalone Java example of the core queue logic. It demonstrates patient registration, token handling, emergency prioritization, and waiting-queue management.

## Features

- **Patient Registration:** Enter a patient's name, age, and symptoms in the web interface.
- **Token Generation:** Automatically assign a token number to each registered patient.
- **Emergency Priority:** Emergency patients are prioritized over normal patients.
- **Queue Management:** Call the next patient and mark patients as served in the website.
- **Patient Records:** View registered patients and their status.
- **Dashboard Statistics:** Track total, waiting, and served patients.
- **Browser Storage:** The website stores queue data in the current browser using `localStorage`.
- **Java Queue Example:** A console-based Java program demonstrates emergency-first priority and token-number ordering.
- **Responsive Interface:** The website layout adapts to different screen sizes.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Java
- Java `PriorityQueue` and `Comparator`
- Browser `localStorage`

## Project Structure

```text
QURE-Hospital-Queue/
├── index.html          # Website structure
├── style.css           # Website styling and responsive layout
├── script.js           # Website queue logic and browser storage
├── HospitalQueue.java  # Standalone Java queue demonstration
└── README.md           # Project documentation
```

## Run the Website

1. Download or clone the repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the Live Server extension for local testing.

## Run the Java Program

You need a Java Development Kit (JDK) installed.

1. Open a terminal in the folder containing `HospitalQueue.java`.
2. Compile the file:

   ```bash
   javac HospitalQueue.java
   ```

3. Run the program:

   ```bash
   java HospitalQueue
   ```

The example registers sample patients, displays the waiting order, and calls patients in priority order. It uses fictional sample names.

## How to Use the Website

1. Enter a patient's name, age, and symptoms.
2. Select the emergency option when applicable.
3. Click **Add Patient** to register the patient and generate a token.
4. Click **Call Next Patient** to call the next patient.
5. Click **Mark Served** when the patient's turn is complete.
6. Review the waiting queue, patient records, and dashboard statistics.

Emergency patients are prioritized over normal patients. Within the same priority group, patients are handled in token-number order.

## GitHub Pages

The website can be published using GitHub Pages. Open the repository's **Settings → Pages** section to find the published website URL.

The Java file is source code for a separate console demonstration. GitHub Pages serves the static website; it does not compile or run the Java program.

## Limitations and Privacy

This project is intended for educational and demonstration purposes.

- Website data is stored in the current browser using `localStorage`.
- Data is not automatically shared across browsers or devices.
- Browser local storage is not suitable for confidential medical information.
- The Java program is a standalone example and does not connect to the website or a database.
- Use fictional patient details when testing or demonstrating the project.

Do not use this demo to manage real patient information or clinical workflows.

## Future Enhancements

- Secure server-side database integration
- User authentication and role-based access
- Shared queue data across devices
- Reports and queue analytics
- Integration between the Java backend and the website

## Conclusion

QURE demonstrates hospital queue management concepts through a responsive web interface and a Java console example, including patient registration, emergency prioritization, token ordering, and queue tracking.
