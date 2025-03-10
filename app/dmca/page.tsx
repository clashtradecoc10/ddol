import DMCANotice from "@/components/DMCANotice";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Page = () => {
  return (
    <div className="flex flex-1 bg-muted items-center justify-center py-6">
      <MaxWidthWrapper>
        <DMCANotice />
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
