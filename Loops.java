public class Loops {
    public static void main(String[] args) {
        int compteur = 0;
        for (int i = 0; i < 5; ++i) {
            ++compteur;
        }
        
        while (compteur != 0) {
            for (int j = 0; j < compteur; ++j) {
                System.out.println("Bonjour");
            }
            
            --compteur;
        }
    }
}
