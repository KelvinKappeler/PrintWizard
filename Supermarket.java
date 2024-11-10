public class Supermarket {

    public static void main(String[] args) {
        // Create a new person and car objects
        Person alice = new Person("Alice", 30);
        Car car = new Car("Toyota", 2005);

        // Update the person's age and car's year
        alice.setAge(31);
        car.setYear(2010);

        // Perform some more modifications
        alice.setName("Alice Smith");
        car.setModel("Honda");
    }

    public static class Person {
        private String name;
        private int age;

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }

    public static class Car {
        private String model;
        private int year;

        public Car(String model, int year) {
            this.model = model;
            this.year = year;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public void setYear(int year) {
            this.year = year;
        }
    }
}
