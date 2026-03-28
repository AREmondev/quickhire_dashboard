"use client";

import { useState, useMemo } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { AdminButton } from "@/components/admin/AdminButton";
import { Form } from "@/components/admin/forms/Form";
import { TextField } from "@/components/admin/forms/Fields";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  LoadingRow,
  EmptyState,
  ErrorBanner,
  SuccessBanner,
} from "@/components/admin/Feedback";
import { CategorySchema, type CategoryInput } from "@/lib/validators/company";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/lib/hooks/categories";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiPriceTag3Line,
  RiCloseLine,
  RiEditLine,
} from "react-icons/ri";
import type { Category } from "@/lib/api/types";
import { useSession } from "next-auth/react";

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const categoriesQuery = useCategoriesQuery();
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation(editData?.id || "");
  const deleteMutation = useDeleteCategoryMutation(deleteId || "");

  const handleFormSubmit = async (data: CategoryInput) => {
    if (!session) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editData) {
        await updateMutation.mutateAsync({
          name: data.name,
          color: data.color || undefined,
        });
        setSuccess("Category updated successfully!");
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          color: data.color || undefined,
        });
        setSuccess("Category created successfully!");
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

  const handleEdit = (category: Category) => {
    setEditData(category);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteId || !session) return;
    setDeleteLoading(true);
    try {
      await deleteMutation.mutateAsync();
      setDeleteId(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const PRESET_COLORS = [
    "#4640DE",
    "#FFB836",
    "#56CDAD",
    "#FF6550",
    "#26A4FF",
    "#F85E9F",
    "#8B5CF6",
    "#10B981",
  ];

  return (
    <>
      <AdminTopbar title="Categories" subtitle="Manage job categories" />
      <main className="flex-1 p-6 space-y-5">
        {(error || categoriesQuery.error) && (
          <ErrorBanner
            message={error || (categoriesQuery.error as Error)?.message}
          />
        )}
        {success && <SuccessBanner message={success} />}

        <div className="flex justify-end">
          <AdminButton
            leftIcon={showForm ? <RiCloseLine /> : <RiAddLine />}
            variant={showForm ? "outline" : "primary"}
            onClick={showForm ? handleCancel : () => setShowForm(true)}
          >
            {showForm ? "Cancel" : "Add Category"}
          </AdminButton>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6 animate-fadeInUp max-w-md">
            <h2 className="text-sm font-bold text-neutral-100 mb-4">
              {editData ? "Edit Category" : "New Category"}
            </h2>
            <Form<CategoryInput>
              schema={CategorySchema}
              defaultValues={{
                name: editData?.name || "",
                color: editData?.color || "#4640DE",
              }}
              onSubmit={handleFormSubmit}
            >
              <div className="space-y-4">
                <TextField
                  name="name"
                  label="Category Name"
                  required
                  placeholder="e.g. Engineering"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-100 mb-2">
                    Color
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        title={c}
                        className="w-7 h-7 rounded-full border-2 border-transparent hover:border-neutral-100 transition-colors"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <TextField
                    name="color"
                    label=""
                    placeholder="#4640DE"
                    hint="Or enter a custom hex color"
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end">
                  <AdminButton
                    type="submit"
                    loading={submitting}
                    leftIcon={editData ? <RiEditLine /> : <RiAddLine />}
                  >
                    {editData ? "Update Category" : "Create Category"}
                  </AdminButton>
                </div>
              </div>
            </Form>
          </div>
        )}

        {/* Categories */}
        {categoriesQuery.isLoading ? (
          <div className="bg-white rounded-xl border border-border p-8">
            <LoadingRow />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={<RiPriceTag3Line />}
              title="No categories yet"
              description="Create categories to organize jobs by field"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-border p-4 flex flex-col items-center gap-2 group hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-neutral-60 hover:text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <RiEditLine size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="text-neutral-60 hover:text-accent-red p-1 rounded-md hover:bg-accent-red/10 transition-colors"
                    title="Delete"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${cat.color || "#4640DE"}20` }}
                >
                  <RiPriceTag3Line
                    className="text-lg"
                    style={{ color: cat.color || "#4640DE" }}
                  />
                </div>
                <p className="text-sm font-semibold text-neutral-100 text-center">
                  {cat.name}
                </p>
                <p className="text-xs text-neutral-60">/{cat.slug}</p>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Category"
          description="Deleting this category will remove it from all jobs. Cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmLabel="Delete"
          loading={deleteLoading}
        />
      </main>
    </>
  );
}
