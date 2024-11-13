public class ImmutableObjects {
    public static void main(String[] args) {
        Weapon w1 = new Weapon("Sword", 10);
        Weapon w2 = new Weapon("Axe", 15);
        
        Player p1 = new Player("Player 1", 100, w1);
        Player p2 = new Player("Player 2", 75, w2);
        
        p1 = p1.withLife(50);
        p2 = p2.withWeapon(w1.withName("Spear").withDamage(20));
        
        System.out.println("Player 1: " + p1.getName() + " - " + p1.getLife() + " - " + p1.getWeapon().getName() + " - " + p1.getWeapon().getDamage());
        System.out.println("Player 2: " + p2.getName() + " - " + p2.getLife() + " - " + p2.getWeapon().getName() + " - " + p2.getWeapon().getDamage());
    }
    
    public static class Player {
        private final String name;
        private final int life;
        private final Weapon weapon;
        
        public Player(String name, int life, Weapon weapon) {
            this.name = name;
            this.life = life;
            this.weapon = weapon;
        }
        
        public String getName() {
            return name;
        }
        
        public int getLife() {
            return life;
        }
        
        public Weapon getWeapon() {
            return weapon;
        }
        
        public Player withLife(int life) {
            return new Player(name, life, weapon);
        }
        
        public Player withWeapon(Weapon weapon) {
            return new Player(name, life, weapon);
        }
        
        public Player withName(String name) {
            return new Player(name, life, weapon);
        }
    }
    
    public static class Weapon {
        private final String name;
        private final int damage;
        
        public Weapon(String name, int damage) {
            this.name = name;
            this.damage = damage;
        }
        
        public String getName() {
            return name;
        }
        
        public int getDamage() {
            return damage;
        }
        
        public Weapon withName(String name) {
            return new Weapon(name, damage);
        }
        
        public Weapon withDamage(int damage) {
            return new Weapon(name, damage);
        }
    }
}
