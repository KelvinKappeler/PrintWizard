public class Main {

    public static void main(String[] args) {
        Player bastien = new Player("Bastien", 30);
        Player kelvin = new Player("Kelvin", 20);
        Player shardul = new Player("Shardul", 50);

        bastien.attack(kelvin, 30);
        shardul.attack(bastien, 30);
    }

    public static class Player {
        public final String name;
        public final int hp;

        public Player(String name, int hp) {
            if (hp < 0 || hp > 100) {
                throw new IllegalArgumentException("hp must be between 0 and 100 inclusive");
            }

            this.name = name;
            this.hp = hp;
        }

        public void attack(Player player, int damage) {
            if (player.hp == 0) {
                throw new IllegalStateException("player is already dead");
            }

            if (damage < 0) {
                throw new IllegalArgumentException("damage must be positive");
            }

            player.hp -= damage;
        }
    }
}
