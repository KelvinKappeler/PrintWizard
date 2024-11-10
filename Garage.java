public class Garage {

    public static void main(String[] args) {
        // Create a Car and assign it to a Person
        Car car = new Car("Toyota", 2005);
        Person alice = new Person("Alice", 30, car);

        // Modify fields in both the Person and Car objects
        alice.setAge(31);
        alice.setName("Alice Smith");
        alice.getCar().setModel("Honda");
        alice.getCar().setYear(2010);

        // Further modifications to test nested object field updates
        car.setModel("Ford");

        Car testCar = car;
        alice.setCar(new Car("Mazda", 2022));
    }

    public static class Person {
        private String name;
        private int age;
        private Car car;

        public Person(String name, int age, Car car) {
            this.name = name;
            this.age = age;
            this.car = car;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public Car getCar() {
            return car;
        }

        public void setCar(Car car) {
            this.car = car;
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
