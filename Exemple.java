public class Exemple {
    public static void main(String[] args) {
        int a = f4();
        int b = f3(a);
        f2(b);
    }

    public static void f1() {
        System.out.println("Hello World!");
    }

    public static void f2(int a) {
        System.out.println(a);
    }

    public static int f3(int a) {
        return a + 3;
    }

    public static int f4() {
        f1();
        return 5;
    }
}
