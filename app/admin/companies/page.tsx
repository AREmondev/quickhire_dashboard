"use client";

import { useState, useMemo } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { AdminButton } from "@/components/admin/AdminButton";
import { Form } from "@/components/admin/forms/Form";
import { TextField, TextAreaField } from "@/components/admin/forms/Fields";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  LoadingRow,
  EmptyState,
  ErrorBanner,
  SuccessBanner,
} from "@/components/admin/Feedback";
import { CompanySchema, type CompanyInput } from "@/lib/validators/company";
import {
  useCompaniesQuery,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyMutation,
} from "@/lib/hooks/companies";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiBuilding2Line,
  RiCloseLine,
  RiGlobalLine,
  RiMapPinLine,
  RiEditLine,
} from "react-icons/ri";
import { useSession } from "next-auth/react";
import type { Company } from "@/lib/api/types";

export default function AdminCompaniesPage() {
  const { data: session } = useSession();
  const companiesQuery = useCompaniesQuery();
  const companies = useMemo(
    () => companiesQuery.data ?? [],
    [companiesQuery.data],
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const createMutation = useCreateCompanyMutation();
  const updateMutation = useUpdateCompanyMutation(editData?.id || "");
  const deleteMutation = useDeleteCompanyMutation(deleteId || "");

  const handleFormSubmit = async (data: CompanyInput) => {
    if (!session) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editData) {
        await updateMutation.mutateAsync({
          name: data.name,
          website: data.website,
          location: data.location,
          description: data.description,
          logo: logoFile ?? undefined,
        });
        setSuccess("Company updated successfully!");
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          website: data.website,
          location: data.location,
          description: data.description,
          logo: logoFile ?? undefined,
        });
        setSuccess("Company created successfully!");
      }
      setShowForm(false);
      setEditData(null);
      setLogoFile(null);
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditData(company);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
    setLogoFile(null);
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

  return (
    <>
      <AdminTopbar title="Companies" subtitle="Manage company profiles" />
      <main className="flex-1 p-6 space-y-5">
        {(error || companiesQuery.error) && (
          <ErrorBanner
            message={error || (companiesQuery.error as Error)?.message}
          />
        )}
        {success && <SuccessBanner message={success} />}

        {/* Toolbar */}
        <div className="flex justify-end">
          <AdminButton
            leftIcon={showForm ? <RiCloseLine /> : <RiAddLine />}
            variant={showForm ? "outline" : "primary"}
            onClick={showForm ? handleCancel : () => setShowForm(true)}
          >
            {showForm ? "Cancel" : "Add Company"}
          </AdminButton>
        </div>

        {/* Create/Edit form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6 animate-fadeInUp">
            <h2 className="text-sm font-bold text-neutral-100 mb-4">
              {editData ? "Edit Company" : "New Company"}
            </h2>
            <Form<CompanyInput>
              schema={CompanySchema}
              defaultValues={{
                name: editData?.name || "",
                website: editData?.website || "",
                location: editData?.location || "",
                description: editData?.description || "",
              }}
              onSubmit={handleFormSubmit}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="name"
                    label="Company Name"
                    required
                    placeholder="e.g. Acme Corp"
                  />
                  <TextField
                    name="location"
                    label="Location"
                    placeholder="e.g. San Francisco, US"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-100">
                      Logo (image)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="px-3 py-2.5 text-sm rounded-lg border bg-white outline-none transition-all border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    {editData?.logoUrl && !logoFile && (
                      <p className="text-xs text-primary italic">
                        Keep empty to retain current logo
                      </p>
                    )}
                    <p className="text-xs text-neutral-60">
                      Optional. JPG/PNG up to 5MB.
                    </p>
                  </div>
                  <TextField
                    name="website"
                    label="Website"
                    placeholder="https://example.com"
                  />
                </div>
                <TextAreaField
                  name="description"
                  label="Description"
                  rows={3}
                />
                <div className="flex justify-end pt-2">
                  <AdminButton
                    type="submit"
                    loading={submitting}
                    leftIcon={editData ? <RiEditLine /> : <RiAddLine />}
                  >
                    {editData ? "Update Company" : "Create Company"}
                  </AdminButton>
                </div>
              </div>
            </Form>
          </div>
        )}

        {/* Companies grid */}
        {companiesQuery.isLoading ? (
          <div className="bg-white rounded-xl border border-border p-8">
            <LoadingRow />
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={<RiBuilding2Line />}
              title="No companies yet"
              description="Add your first company to start posting jobs"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="w-8 h-8 object-contain rounded"
                        />
                      ) : (
                        <RiBuilding2Line className="text-primary text-lg" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-100 truncate">
                        {company.name}
                      </p>
                      {company.location && (
                        <p className="text-xs text-neutral-60 flex items-center gap-1 mt-0.5">
                          <RiMapPinLine className="shrink-0" />{" "}
                          {company.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-neutral-60 hover:text-primary p-1 rounded-lg hover:bg-primary/10 transition-colors"
                      title="Edit"
                    >
                      <RiEditLine />
                    </button>
                    <button
                      onClick={() => setDeleteId(company.id)}
                      className="text-neutral-60 hover:text-accent-red p-1 rounded-lg hover:bg-accent-red/10 transition-colors"
                      title="Delete"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
                {company.description && (
                  <p className="text-xs text-neutral-60 mt-3 line-clamp-2">
                    {company.description}
                  </p>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline"
                  >
                    <RiGlobalLine /> {company.website}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Company"
          description="Deleting a company will also affect all its jobs. Cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmLabel="Delete"
          loading={deleteLoading}
        />
      </main>
    </>
  );
}
