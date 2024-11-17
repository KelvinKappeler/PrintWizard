public class Arrays {
    public static void main(String[] args) {
        int[] numbers = new int[5] {1, 2, 3, 4, 5};
        System.out.println(numbers[0]);

        Player[] players = new Player[2] {
            new Player("Bastien", 30),
            new Player("Kelvin", 20)
        };
        System.out.println(players[0].name);
    }

    static class Player {
        public final String name;
        public final int hp;

        public Player(String name, int hp) {
            this.name = name;
            this.hp = hp;
        }
    }
}
