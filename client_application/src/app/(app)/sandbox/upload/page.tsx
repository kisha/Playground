import type { Metadata } from "next";

import { PageIntro } from "@/components/page-intro";
import { CsvUpload } from "@/components/upload/csv-upload";

export const metadata: Metadata = {
  title: "Uploads",
  description: "Drop a CSV and check its columns and rows, in the browser.",
};

export default function UploadPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Uploads">
        <p>
          Drop a CSV to check its columns and rows. This example only reads the file in your browser, so a real upload
          still needs an endpoint, and a plan for protecting what&apos;s in the file.
        </p>
      </PageIntro>
      <CsvUpload />
    </>
  );
}
