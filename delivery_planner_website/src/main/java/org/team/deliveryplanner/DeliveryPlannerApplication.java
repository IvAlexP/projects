package org.team.deliveryplanner;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main class for the Delivery Planner application.
 * This class initializes the application and loads environment variables.
 */
@SpringBootApplication
public class DeliveryPlannerApplication {

    /**
     * The entry point of the Delivery Planner application.
     * @param args command-line arguments passed to the application
     */
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory(".")
                .ignoreIfMissing()
                .load();
        
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
        
        SpringApplication.run(DeliveryPlannerApplication.class, args);
    }

}
