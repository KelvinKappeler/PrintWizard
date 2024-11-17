public class Arrays {
    public static void main(String[] args) {
        int[] numbers = new int[]{1, 2, 3, 4, 5};

        Player[] players = new Player[] {
            new Player("Bastien", 30),
            new Player("Kelvin", 20)
        };
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
