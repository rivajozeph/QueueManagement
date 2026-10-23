
import java.util.LinkedList;
import java.util.Queue;
import java.util.PriorityQueue;
import java.util.Comparator;

public class HospitalQueue {

    private final Queue<Patient> normalQueue = new LinkedList<>();

    private final PriorityQueue<Patient> emergencyQueue =
            new PriorityQueue<>(
                    Comparator.comparingInt(Patient::getTokenNumber)
            );

    public void addPatient(Patient patient) {
        if (patient.isEmergency()) {
            emergencyQueue.add(patient);
        } else {
            normalQueue.add(patient);
        }
    }

    public Patient callNextPatient() {
        if (!emergencyQueue.isEmpty()) {
            return emergencyQueue.poll();
        }

        if (!normalQueue.isEmpty()) {
            return normalQueue.poll();
        }

        return null;
    }

    public boolean isEmpty() {
        return emergencyQueue.isEmpty() && normalQueue.isEmpty();
    }
}
