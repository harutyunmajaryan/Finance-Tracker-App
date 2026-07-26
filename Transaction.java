public class Transaction {
    private String Name;
    private String TransactionAccountNumber;
    private String TransactionSortCode;
    private float TransactionMoney;
    private String Reason;

    public Transaction(String Name, String TransactionAccountNumber, String TransactionSortCode, String Reason, float TransactionMoney){
        this.Name = Name;
        this.TransactionAccountNumber = TransactionAccountNumber;
        this.TransactionSortCode = TransactionSortCode;
        this.TransactionMoney = TransactionMoney;
        this.Reason = Reason;
    }
    public String getName(){
        return Name;
    }

    public String getAccountNumber() {
        return TransactionAccountNumber;
    }

    public String getSortCode(){
        return TransactionSortCode;
    }
    public String getReason(){
        return Reason;
    }
    public float getTransactionMoney(){
        return TransactionMoney;
    }

    public static void main(String[] args){

        boolean status = true;
        java.util.Scanner scanner = new java.util.Scanner(System.in);

        while(status){
            System.out.print("Please fill the credentials below: (Enter e to exit) ");

        System.out.print("Account Number: ");
        String accNumber = scanner.nextLine();

        System.out.print("Sort Code: ");
        String sortCode = scanner.nextLine();

        System.out.print("Name: ");
        String name = scanner.nextLine();

        System.out.print("Money: ");
        float money = scanner.Float();

        System.out.print("Reason: ");
        String reason = scanner.nextLine();

        Transaction transaction = new Transaction();

        }
        
        





    }
}	
