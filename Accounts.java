import java.util.List;
import java.util.ArrayList;

public class Account {
    private String accountNumber;
    private String sortCode;
    private String name;

    public static List<Account> valid_accounts = new ArrayList<>();
    public static List<Account> verifiedList = new ArrayList<>();

    public Account(String accountNumber, String sortCode, String name){
        this.accountNumber = accountNumber;
        this.sortCode = sortCode;
        this.name = name;
    }

    public String getAccountNumber(){
        return accountNumber;
    }

    public String getSortCode(){
        return sortCode;
    }

    public String getName(){
        return name;
    }

    @Override
    public String toString(){
        return "Account Number: " + accountNumber + ", Sort-Code: " + sortCode + ", Name: " + name;
    }

    public static void main(String[] args){
        System.out.println("All Available and Valid Accounts: ");
        System.out.println();
        AccountList();
    }

    public static void AccountList(){
        Account account1 = new Account("90345688", "232111", "John McTomminay");
        Account account2 = new Account("78900312","447889","Lily Adams");
        Account account3 = new Account("39867291","556790","Mery Kendall");
        Account account4 = new Account("35283572","339874","Daisy Jenner");
        Account account5 = new Account("221152", "553821","Lilit Manukyan");
        Account account6 = new Account("9023785A","237899","Harry Maguire");

        List<Account> account_array = new ArrayList<>();
        account_array.add(account1);
        account_array.add(account2);
        account_array.add(account3);
        account_array.add(account4);
        account_array.add(account5);
        account_array.add(account6);

        valid_accounts = new ArrayList<>();

        for (Account account : account_array){
            if (account.getAccountNumber().length() == 8 && account.getSortCode().length() == 6){
                valid_accounts.add(account);
            }
        }

        List<Account> strictly_valid = AccountValidation2(valid_accounts);
        for (Account account : strictly_valid){
            System.out.println(account);
        }
    }

    public static List<Account> AccountValidation2(List<Account> array){
        verifiedList = new ArrayList<>();

        for (Account account : array){
            boolean isValid = true;

            for (int i = 0; i < account.getAccountNumber().length(); i++){
                if (!Character.isDigit(account.getAccountNumber().charAt(i))){
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                for (int i = 0; i < account.getSortCode().length(); i++){
                    if(!Character.isDigit(account.getSortCode().charAt(i))){
                        isValid = false;
                        break;
                    }
                }
            }

            if (isValid) {
                verifiedList.add(account);
            }
        }
        return verifiedList;
    }
}
