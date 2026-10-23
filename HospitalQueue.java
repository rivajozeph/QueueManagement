import java.util.PriorityQueue;
import java.util.Comparator;

/**
 * QURE - Hospital Queue Management System
 *
 * Demonstrates emergency-priority and normal FIFO queue handling.
 * This is a console-based Java example of the queue logic used by QURE.
 *
 * Compile: javac HospitalQueue.java
 * Run:     java HospitalQueue
 */
public class HospitalQueue {

    private static class Patient {
        private final int tokenNumber;
        private final String name;
        private final boolean emergency;

        Patient(int tokenNumber, String name, boolean emergency) {
            this.tokenNumber = tokenNumber;
            this.name = name;
            this.emergency = emergency;
        }

        @Override
        public String toString() {
            String priority = emergency ? "EMERGENCY" : "NORMAL";
            return "Token #" + tokenNumber + " | " + name + " | " + priority;
        }
    }
    // Emergency patients first, then lower token numbers first.
    private final PriorityQueue<Patient> waitingQueue =
        new PriorityQueue<>(
            Comparator.comparing((Patient patient) -> !patient.emergency)
                      .thenComparingInt(patient -> patient.tokenNumber)
        );

    public void addPatient(int tokenNumber, String name, boolean emergency) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient name cannot be empty.");
        }

        waitingQueue.offer(new Patient(tokenNumber, name.trim(), emergency));
        System.out.println("Registered: " + waitingQueue.stream()
            .filter(patient -> patient.tokenNumber == tokenNumber)
            .findFirst().orElse(null));
    }

    public Patient callNextPatient() {
        Patient nextPatient = waitingQueue.poll();

        if (nextPatient == null) {
            System.out.println("No patients are waiting.");
            return null;
        }

        System.out.println("Now calling: " + nextPatient);
        return nextPatient;
    }

    public void displayWaitingQueue() {
        if (waitingQueue.isEmpty()) {
            System.out.println("The waiting queue is empty.");
            return;
        }

        System.out.println("\nWaiting patients (in calling order):");
        PriorityQueue<Patient> copy = new PriorityQueue<>(waitingQueue);
        while (!copy.isEmpty()) {
            System.out.println(copy.poll());
        }
    }

    public static void main(String[] args) {
        HospitalQueue queue = new HospitalQueue();

        queue.addPatient(101, "Alex", false);
        queue.addPatient(102, "Sam", true);
        queue.addPatient(103, "Jordan", false);

        queue.displayWaitingQueue();

        System.out.println();
        queue.callNextPatient(); // Emergency patient is called first.
        queue.callNextPatient(); // Then the earliest normal token.
        queue.callNextPatient();
        queue.callNextPatient(); // Empty-queue example.
    }
}

