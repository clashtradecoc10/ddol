import { listS3FolderContents } from "@/actions/get-s3-folder-objects";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UnlockedContent } from "@/components/UnlockedContent";

export default async function page() {
  const urls = await listS3FolderContents("test2");

  return (
    <div className="flex flex-1 bg-muted items-center justify-center py-6">
      <MaxWidthWrapper className="space-y-6">
        <UnlockedContent content={urls.files} />
      </MaxWidthWrapper>
    </div>
  );
}
