public class Personal {
    private final float Balance = 10000;
    private final String personalAccountNumber = "12902389";
    private final String personalSortCode = "347600";
    private final String personalName = "Harutyun Majaryan";

    public Personal() {
    }

    public String getPersonalAccountNumber(){
        return personalAccountNumber;
    }

    public String getPersonalSortCode(){
        return personalSortCode;
    }

    public String getPersonalName(){
        return personalName;
    }

    public float getBalance(){
        return Balance;
    }

    public static void main(String[] args){
        
        Personal myAccount = new Personal();
        
        System.out.println("Your Personal Banking Details: ");
        System.out.println("Your Name: " + myAccount.getPersonalName());
        System.out.println("Personal AccountNumber: " + myAccount.getPersonalAccountNumber());
        System.out.println("Personal SortCode: " + myAccount.getPersonalSortCode());
        System.out.println("Your Balance: " + myAccount.getBalance());
    }
}
