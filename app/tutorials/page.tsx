import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Tutorials from "@/components/Tutorials";

const Page = () => {
  return (
    <div className="flex flex-1 bg-muted items-center justify-center py-6">
      <MaxWidthWrapper>
        <Tutorials />
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
