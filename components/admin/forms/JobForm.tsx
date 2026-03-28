"use client";

import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
  MultiSelectField,
} from "@/components/admin/forms/Fields";
import { AdminButton } from "@/components/admin/AdminButton";
import { RiSaveLine, RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import { useFormContext, useFieldArray } from "react-hook-form";
import type {
  Company,
  Category,
  ExperienceLevel,
  JobType,
} from "@/lib/api/types";
import { useState } from "react";

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "BDT", label: "BDT — Bangladeshi Taka" },
];

const QUESTION_TYPES = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "short-answer", label: "Short Answer" },
  { value: "true-false", label: "True/False" },
  { value: "problem-solve", label: "Problem Solving" },
];

interface JobFormProps {
  companies: Company[];
  categories?: Category[];
  experienceLevels?: ExperienceLevel[];
  jobTypes?: JobType[];
  loading?: boolean;
  submitLabel?: string;
  serverError?: string;
  hideAssessment?: boolean;
}

export default function JobForm({
  companies,
  categories = [],
  experienceLevels = [],
  jobTypes = [],
  loading,
  submitLabel = "Save Job",
  serverError,
  hideAssessment = false,
}: JobFormProps) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assessment.questions",
  });

  const hasAssessment = !!watch("_hasAssessment");

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const experienceLevelOptions = experienceLevels.map((el) => ({
    value: el._id,
    label: el.name,
  }));
  console.log("jobTypes", jobTypes);
  const jobTypeOptions = jobTypes.map((jt) => ({
    value: jt._id,
    label: jt.name,
  }));

  const questions = watch("assessment.questions") || [];

  // Get all error messages recursively
  const getAllErrors = (errors: any): string[] => {
    let messages: string[] = [];
    for (const key in errors) {
      if (errors[key]?.message) {
        messages.push(String(errors[key].message));
      } else if (typeof errors[key] === "object") {
        messages = [...messages, ...getAllErrors(errors[key])];
      }
    }
    return messages;
  };

  const validationErrors = getAllErrors(errors);

  return (
    <div className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-accent-red/30 bg-accent-red/5 px-4 py-3 text-sm text-accent-red">
          <p className="font-bold mb-1">Server Error</p>
          <p>{serverError}</p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="rounded-lg border border-accent-red/30 bg-accent-red/5 px-4 py-3 text-sm text-accent-red">
          <p className="font-bold mb-1">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-bold text-neutral-100 pb-2 border-b border-border">
          Basic Information
        </h2>
        <TextField
          name="title"
          label="Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          required
        />

        <SelectField
          name="companyId"
          label="Company"
          options={companyOptions}
          placeholder="Select a company…"
          required
        />

        <MultiSelectField
          name="categoryIds"
          label="Categories"
          options={categoryOptions}
          className="pt-2"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            name="jobType"
            label="Job Type"
            options={jobTypeOptions}
            placeholder="Select type…"
            required
          />
          <SelectField
            name="experienceLevel"
            label="Experience Level"
            options={experienceLevelOptions}
            placeholder="Select level…"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="location"
            label="Location"
            placeholder="e.g. Dublin, Ireland"
            required
          />
          <TextField
            name="deadline"
            label="Application Deadline"
            type="date"
            hint="Optional — leave blank for no deadline"
          />
        </div>

        <div className="flex items-center gap-6">
          <CheckboxField name="isRemote" label="Remote Friendly" />
          <CheckboxField name="isFeatured" label="Featured Job" />
        </div>
      </div>

      {/* Salary */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-bold text-neutral-100 pb-2 border-b border-border">
          Salary Range
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            name="salaryMin"
            label="Min Salary"
            type="number"
            placeholder="60000"
            required
          />
          <TextField
            name="salaryMax"
            label="Max Salary"
            type="number"
            placeholder="100000"
            required
          />
          <SelectField
            name="salaryCurrency"
            label="Currency"
            options={CURRENCIES}
            required
          />
        </div>
      </div>

      {/* Assessment */}
      {!hideAssessment && (
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-neutral-100">
              Assessment (Optional)
            </h2>
            <CheckboxField
              name="_hasAssessment"
              label="Include Assessment"
              onChange={(e: any) => {
                if (e.target.checked && fields.length === 0) {
                  append({
                    questionText: "",
                    questionType: "multiple-choice",
                    options_raw: "",
                    options: [],
                  });
                }
              }}
            />
          </div>

          {hasAssessment && (
            <div className="space-y-6 pt-2">
              <TextField
                name="assessment.title"
                label="Assessment Title"
                placeholder="e.g. Technical Quiz"
                required
              />

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-border rounded-lg bg-light-gray/20 space-y-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-neutral-40 hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Question"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        name={`assessment.questions.${index}.questionText`}
                        label={`Question ${index + 1}`}
                        placeholder="Enter question text…"
                        required
                      />
                      <SelectField
                        name={`assessment.questions.${index}.questionType`}
                        label="Question Type"
                        options={QUESTION_TYPES}
                        required
                      />
                    </div>

                    {questions[index]?.questionType === "multiple-choice" && (
                      <div className="space-y-3">
                        <TextField
                          name={`assessment.questions.${index}.options_raw`}
                          label="Options (comma separated)"
                          placeholder="e.g. Option A, Option B, Option C"
                          hint="At least 2 options required"
                          onChange={(e: any) => {
                            const val = e.target.value;
                            const options = val
                              .split(",")
                              .map((o: string) => o.trim())
                              .filter(Boolean);
                            setValue(
                              `assessment.questions.${index}.options`,
                              options,
                            );
                          }}
                        />
                        <TextField
                          name={`assessment.questions.${index}.correctAnswer`}
                          label="Correct Answer"
                          placeholder="Must match one of the options"
                        />
                      </div>
                    )}

                    {questions[index]?.questionType === "true-false" && (
                      <div className="space-y-3">
                        <SelectField
                          name={`assessment.questions.${index}.correctAnswer`}
                          label="Correct Answer"
                          options={[
                            { value: "true", label: "True" },
                            { value: "false", label: "False" },
                          ]}
                          required
                        />
                      </div>
                    )}

                    {(questions[index]?.questionType === "short-answer" ||
                      questions[index]?.questionType === "problem-solve") && (
                      <div className="space-y-3">
                        <TextAreaField
                          name={`assessment.questions.${index}.correctAnswer`}
                          label="Expected Solution / Key Points"
                          placeholder="Enter the expected answer or key evaluation points…"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}

                <AdminButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      questionText: "",
                      questionType: "multiple-choice",
                      options_raw: "",
                      options: [],
                    })
                  }
                  leftIcon={<RiAddLine />}
                >
                  Add Question
                </AdminButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-bold text-neutral-100 pb-2 border-b border-border">
          Job Content
        </h2>
        <TextAreaField
          name="description"
          label="Job Description"
          placeholder="Describe the role, team, and expectations…"
          rows={5}
          required
        />
        <TextAreaField
          name="responsibilities"
          label="Responsibilities"
          placeholder="One responsibility per line"
          rows={4}
          hint="Enter one responsibility per line. They'll be saved as a list."
        />
        <TextAreaField
          name="requirements"
          label="Requirements"
          placeholder="One requirement per line"
          rows={4}
          hint="Enter one requirement per line."
        />
        <TextAreaField
          name="benefits"
          label="Benefits"
          placeholder="e.g. Remote Friendly, Health Insurance, Equity Package"
          rows={3}
          hint="Enter one benefit per line."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <AdminButton
          type="submit"
          loading={loading || isSubmitting}
          leftIcon={<RiSaveLine />}
          size="lg"
        >
          {submitLabel}
        </AdminButton>
      </div>
    </div>
  );
}
