"use client";

import { useMemo, useState } from "react";
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiFileList3Line,
  RiEditLine,
} from "react-icons/ri";
import { useSession } from "next-auth/react";
import {
  useExperienceLevelsQuery,
  useCreateExperienceLevelMutation,
  useDeleteExperienceLevelMutation,
  useUpdateExperienceLevelMutation,
} from "@/lib/hooks/experience-levels";
import type { ExperienceLevel } from "@/lib/api/types";
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

const ExperienceLevelSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

type ExperienceLevelInput = z.infer<typeof ExperienceLevelSchema>;

export default function AdminExperienceLevelsPage() {
  const { data: session } = useSession();
  const experienceLevelsQuery = useExperienceLevelsQuery();
  const experienceLevels = useMemo(
    () => experienceLevelsQuery.data ?? [],
    [experienceLevelsQuery.data],
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<ExperienceLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createMutation = useCreateExperienceLevelMutation();
  const updateMutation = useUpdateExperienceLevelMutation(editData?._id || "");
  const deleteMutation = useDeleteExperienceLevelMutation(deleteId || "");

  const handleFormSubmit = async (data: ExperienceLevelInput) => {
    if (!session) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editData) {
        await updateMutation.mutateAsync({ name: data.name });
        setSuccess("Experience level updated successfully!");
      } else {
        await createMutation.mutateAsync({ name: data.name });
        setSuccess("Experience level created successfully!");
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

  const handleEdit = (level: ExperienceLevel) => {
    setEditData(level);
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
      setSuccess("Experience level deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Experience Levels"
        subtitle="Manage job experience levels"
      />
      <main className="flex-1 p-6 space-y-5">
        {(error || experienceLevelsQuery.error) && (
          <ErrorBanner
            message={error || (experienceLevelsQuery.error as Error)?.message}
          />
        )}
        {success && <SuccessBanner message={success} />}

        <div className="flex justify-end">
          <AdminButton
            leftIcon={showForm ? <RiCloseLine /> : <RiAddLine />}
            variant={showForm ? "outline" : "primary"}
            onClick={showForm ? handleCancel : () => setShowForm(true)}
          >
            {showForm ? "Cancel" : "Add Experience Level"}
          </AdminButton>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6 animate-fadeInUp max-w-md">
            <h2 className="text-sm font-bold text-neutral-100 mb-4">
              {editData ? "Edit Experience Level" : "New Experience Level"}
            </h2>
            <Form<ExperienceLevelInput>
              schema={ExperienceLevelSchema}
              defaultValues={{ name: editData?.name || "" }}
              onSubmit={handleFormSubmit}
            >
              <div className="space-y-4">
                <TextField
                  name="name"
                  label="Name"
                  placeholder="e.g. Entry Level"
                />
                <div className="flex justify-end">
                  <AdminButton
                    type="submit"
                    loading={submitting}
                    leftIcon={editData ? <RiEditLine /> : <RiAddLine />}
                  >
                    {editData ? "Update" : "Create"} Experience Level
                  </AdminButton>
                </div>
              </div>
            </Form>
          </div>
        )}

        {experienceLevelsQuery.isLoading ? (
          <div className="bg-white rounded-xl border border-border p-8">
            <LoadingRow />
          </div>
        ) : experienceLevels.length === 0 ? (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={<RiFileList3Line />}
              title="No experience levels yet"
              description="Create experience levels to organize jobs"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {experienceLevels.map((level) => (
              <div
                key={level._id}
                className="bg-white rounded-xl border border-border p-4 flex flex-col items-center gap-2 group hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(level)}
                    className="text-neutral-60 hover:text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <RiEditLine size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(level._id)}
                    className="text-neutral-60 hover:text-accent-red p-1 rounded-md hover:bg-accent-red/10 transition-colors"
                    title="Delete"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-neutral-100 text-center">
                  {level.name}
                </p>
                <p className="text-xs text-neutral-60">/{level.slug}</p>
              </div>
            ))}
          </div>
        )}
        <ConfirmDialog
          open={!!deleteId}
          title="Delete Experience Level"
          description="Deleting this experience level will remove it from all jobs. Cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmLabel="Delete"
          loading={deleteLoading}
        />
      </main>
    </>
  );
}
