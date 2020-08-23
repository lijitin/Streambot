namespace StreamBot.Services
{
    public class DummyService : IDummyService
    {
        public void func(){
            return;
        }

        public string getString()
        {
            return "Ok";
        }
    }
}