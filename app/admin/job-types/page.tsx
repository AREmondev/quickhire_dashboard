"use client";

import { useMemo, useState } from "react";
import {
  RiAddLine,
  RiCloseLine,
  RiFileList3Line,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { useSession } from "next-auth/react";
import {
  useJobTypesQuery,
  useCreateJobTypeMutation,
  useDeleteJobTypeMutation,
  useUpdateJobTypeMutation,
} from "@/lib/hooks/job-types";
import type { JobType } from "@/lib/api/types";
import { AdminButton } from "@/components/admin/AdminButton";
import AdminTopbar from "@/components/admin/Topbar";
import {
  ErrorBanner,
  SuccessBanner,
  LoadingRow,
  EmptyState,
} from "@/components/admin/Feedback";
import { Form } from "@/components/admin/forms/Form";
import { TextField } from "@/components/admin/forms/Fields";
import { z } from "zod";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const JobTypeSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

type JobTypeInput = z.infer<typeof JobTypeSchema>;

export default function AdminJobTypesPage() {
  const { data: session } = useSession();
  const jobTypesQuery = useJobTypesQuery();
  const jobTypes = useMemo(
    () => jobTypesQuery.data ?? [],
    [jobTypesQuery.data],
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<JobType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createMutation = useCreateJobTypeMutation();
  const updateMutation = useUpdateJobTypeMutation(editData?._id || "");
  const deleteMutation = useDeleteJobTypeMutation(deleteId || "");

  const handleFormSubmit = async (data: JobTypeInput) => {
    if (!session) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editData) {
        await updateMutation.mutateAsync({ name: data.name });
        setSuccess("Job type updated successfully!");
      } else {
        await createMutation.mutateAsync({ name: data.name });
        setSuccess("Job type created successfully!");
      }
      setShowForm(false);
      setEditData(null);
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (type: JobType) => {
    setEditData(type);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteId || !session) return;
    setDeleteLoading(true);
    setError("");
    setSuccess("");
    try {
      await deleteMutation.mutateAsync();
      setDeleteId(null);
      setSuccess("Job type deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminTopbar title="Job Types" subtitle="Manage job types" />
      <main className="flex-1 p-6 space-y-5">
        {(error || jobTypesQuery.error) && (
          <ErrorBanner
            message={error || (jobTypesQuery.error as Error)?.message}
          />
        )}
        {success && <SuccessBanner message={success} />}

        <div className="flex justify-end">
          <AdminButton
            leftIcon={showForm ? <RiCloseLine /> : <RiAddLine />}
            variant={showForm ? "outline" : "primary"}
            onClick={showForm ? handleCancel : () => setShowForm(true)}
          >
            {showForm ? "Cancel" : "Add Job Type"}
          </AdminButton>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6 animate-fadeInUp max-w-md">
            <h2 className="text-sm font-bold text-neutral-100 mb-4">
              {editData ? "Edit Job Type" : "New Job Type"}
            </h2>
            <Form<JobTypeInput>
              schema={JobTypeSchema}
              defaultValues={{ name: editData?.name || "" }}
              onSubmit={handleFormSubmit}
            >
              <div className="space-y-4">
                <TextField
                  name="name"
                  label="Name"
                  placeholder="e.g. Full Time"
                />
                <div className="flex justify-end">
                  <AdminButton
                    type="submit"
                    loading={submitting}
                    leftIcon={editData ? <RiEditLine /> : <RiAddLine />}
                  >
                    {editData ? "Update" : "Create"} Job Type
                  </AdminButton>
                </div>
              </div>
            </Form>
          </div>
        )}

        {jobTypesQuery.isLoading ? (
          <div className="bg-white rounded-xl border border-border p-8">
            <LoadingRow />
          </div>
        ) : jobTypes.length === 0 ? (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={<RiFileList3Line />}
              title="No job types yet"
              description="Create job types to organize jobs"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {jobTypes.map((type) => (
              <div
                key={type._id}
                className="bg-white rounded-xl border border-border p-4 flex flex-col items-center gap-2 group hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(type)}
                    className="text-neutral-60 hover:text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <RiEditLine size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(type._id)}
                    className="text-neutral-60 hover:text-accent-red p-1 rounded-md hover:bg-accent-red/10 transition-colors"
                    title="Delete"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-neutral-100 text-center">
                  {type.name}
                </p>
                <p className="text-xs text-neutral-60">/{type.slug}</p>
              </div>
            ))}
          </div>
        )}
        <ConfirmDialog
          open={!!deleteId}
          title="Delete Job Type"
          description="Deleting this job type will remove it from all jobs. Cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmLabel="Delete"
          loading={deleteLoading}
        />
      </main>
    </>
  );
}
