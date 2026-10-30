/** The filters on the sandbox's Filters example. The keys and values are the API's own; add a filter here. */

export type FilterOption = { value: string; label: string };

export type FilterDefinition = {
  /** The URL query key, and the API's: e.g. "gender" in ?gender=Female. */
  key: string;
  label: string;
  options: FilterOption[];
  /** The value when the URL sets none. Leave out for a filter that offers "All". */
  defaultValue?: string;
};

function optionsFromValues(values: string[]): FilterOption[] {
  return values.map((value) => ({ value, label: value }));
}

export const sandboxFilters: FilterDefinition[] = [
  {
    key: "cohort_year",
    label: "Cohort year",
    defaultValue: "2025",
    options: ["2025", "2024", "2023", "2022", "2021", "2020"].map((year) => ({ value: year, label: `Fall ${year}` })),
  },
  { key: "enrollment_type", label: "Enrollment type", options: optionsFromValues(["New", "Transfer"]) },
  { key: "gender", label: "Gender", options: optionsFromValues(["Female", "Male", "Non-binary"]) },
  { key: "first_gen", label: "First-gen", options: optionsFromValues(["First-gen", "Not first-gen"]) },
  { key: "course_modality", label: "Course modality", options: optionsFromValues(["Online", "On-campus"]) },
];
