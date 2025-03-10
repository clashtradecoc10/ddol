import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import config from "@/app.config";

const PremiumSignIn = ({ isSignIn }: { isSignIn: boolean }) => {
  return (
    <main className="flex flex-col md:flex-row justify-between items-start py-6 md:py-12 md:px-0">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 md:mb-0 md:mr-8 w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-4">{config.name} Premium</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>No Ads.</li>
          <li>Mega.nz and other links.</li>
          <li>All the links checked!</li>
          <li>Around 100 new packs everyday.</li>
        </ul>
        <div className="mt-6">
          <h3 className="font-bold">Get</h3>
          <p>
            The last added Packs, with image preview, title, date and full
            access to all the leaked content.
          </p>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Access</h3>
          <p>
            All our database with +50000 OnlyFans Leaks, you can see the title,
            date added, search by name (coming soon) and of course access to all
            the leaks.
          </p>
        </div>
      </div>
      {isSignIn ? <LoginForm /> : <RegisterForm />}
    </main>
  );
};

export default PremiumSignIn;
