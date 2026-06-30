import java.util.ArrayList;
import java.util.List;


public class Accounts {
    private String AccountNumber;
    private String SortCode;

    public Accounts(String AccountNumber, String SortCode){
        this.AccountNumber = AccountNumber;
        this.SortCode = SortCode;
    }

    public String getAccountNumber(){
        return AccountNumber;
    }
    public String getSortCode(){
        return SortCode;
    }

    public void setAccountNumber(String AccountNumber){
        this.AccountNumber = AccountNumber;
    }
    public void setSortCode(String SortCode){
        this.SortCode = SortCode;
    }
    @Override
    public String toString(){
        return "[" + AccountNumber + ", " + SortCode + "]";
    }


    public static void main(String[] args){
        List<Accounts> accounts = new ArrayList<>();
        Accounts account1 = new Accounts("78356690","234467");
        Accounts account2 = new Accounts("89990023","567899");
        Accounts account3 = new Accounts("34215907","990076");
        

        accounts.add(account1);
        accounts.add(account2);
        accounts.add(account3);


        System.out.println("Available Accounts: " + AccountValidation(accounts));
    }

    public static List<Accounts> AccountValidation(List<Accounts> accounts){
        
        accounts.removeIf(acc -> acc.getAccountNumber().length() != 8 || acc.getSortCode().length() != 6);
        return accounts;
    }
    
}
