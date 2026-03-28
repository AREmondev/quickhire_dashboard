"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminTopbar from "@/components/admin/Topbar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LoadingScreen, ErrorBanner } from "@/components/admin/Feedback";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiCloseLine,
  RiMailLine,
  RiUserLine,
  RiBuildingLine,
  RiMapPinLine,
  RiGlobalLine,
  RiTimeLine,
  RiHistoryLine,
  RiBriefcaseLine,
  RiBook2Line,
  RiCodeSSlashLine,
  RiToolsLine,
  RiLightbulbLine,
  RiExternalLinkLine,
  RiPhoneLine,
} from "react-icons/ri";
import {
  useCandidateApplicationQuery,
  useApplicationAnswersQuery,
  useUpdateApplicationStatusMutation,
} from "@/lib/hooks/applications";
import { useState } from "react";

const ALLOWED_STATUSES = [
  { value: "under_review", label: "Under Review", color: "blue" },
  { value: "interview", label: "Interview", color: "purple" },
  { value: "offer", label: "Offer", color: "green" },
  { value: "hired", label: "Hired", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
];

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [updating, setSubmitting] = useState(false);

  const appQuery = useCandidateApplicationQuery(id);
  const answersQuery = useApplicationAnswersQuery(id);
  const updateStatus = useUpdateApplicationStatusMutation(id);

  const handleStatusUpdate = async (status: string) => {
    try {
      setSubmitting(true);
      await updateStatus.mutateAsync(status);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (appQuery.isLoading) return <LoadingScreen />;
  if (appQuery.error)
    return (
      <>
        <AdminTopbar title="Application Detail" />
        <main className="p-6">
          <ErrorBanner message={(appQuery.error as Error).message} />
        </main>
      </>
    );

  const app = appQuery.data as any; // Using any to handle the extended data structure provided by user
  if (!app) return null;

  const answers = answersQuery.data?.answers || [];
  const profile = app.user?.profile || {};

  return (
    <>
      <AdminTopbar
        title="Application Detail"
        subtitle={`Reviewing application for ${app.jobTitle || app.job?.title || "Position"}`}
      />
      <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-neutral-60 hover:text-primary transition-colors"
        >
          <RiArrowLeftLine /> Back to Applications
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card: Candidate & Job Info */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {app.company?.logoUrl ? (
                      <img
                        src={app.company.logoUrl}
                        alt={app.company.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <RiUserLine size={32} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-100">
                      {app.user?.name || "Candidate Name"}
                    </h2>
                    <p className="text-primary font-medium">
                      Applied for {app.jobTitle || app.job?.title}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-neutral-60">
                      <span className="flex items-center gap-1">
                        <RiMailLine size={14} /> {app.user?.email}
                      </span>
                      {profile.phone && (
                        <span className="flex items-center gap-1">
                          <RiPhoneLine size={14} /> {profile.phone}
                        </span>
                      )}
                      {profile.location && (
                        <span className="flex items-center gap-1">
                          <RiMapPinLine size={14} /> {profile.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-neutral-60 flex items-center gap-1">
                    <RiTimeLine size={12} /> Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Profile / Summary */}
            {profile.summary && (
              <div className="bg-white rounded-xl border border-border p-6 space-y-3">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <RiLightbulbLine className="text-primary" /> Professional
                  Summary
                </h3>
                <p className="text-sm text-neutral-80 leading-relaxed">
                  {profile.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {(profile.skills?.length > 0 ||
              profile.technicalSkills?.length > 0 ||
              profile.tools?.length > 0) && (
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <RiCodeSSlashLine className="text-primary" /> Skills &
                  Technologies
                </h3>
                <div className="space-y-4">
                  {profile.technicalSkills?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-60 uppercase mb-2">
                        Technical Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.technicalSkills.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-primary/5 text-primary text-xs rounded-md border border-primary/10"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.skills?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-60 uppercase mb-2">
                        General Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-neutral-100 text-neutral-80 text-xs rounded-md border border-neutral-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.tools?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-60 uppercase mb-2">
                        Tools
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.tools.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-accent-blue/5 text-accent-blue text-xs rounded-md border border-accent-blue/10"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experiences?.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <RiBriefcaseLine className="text-primary" /> Work Experience
                </h3>
                <div className="space-y-6">
                  {profile.experiences.map((exp: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-neutral-100 last:border-0 pb-2"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary" />
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-neutral-100">
                          {exp.role}
                        </h4>
                        <span className="text-xs font-medium px-2 py-1 bg-light-gray rounded text-neutral-60">
                          {exp.startDate} — {exp.endDate || "Present"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-primary mb-2">
                        {exp.company} • {exp.location}
                      </p>
                      {exp.bullets?.length > 0 && (
                        <ul className="list-disc list-inside space-y-1">
                          {exp.bullets.map((b: any, bIdx: number) => (
                            <li
                              key={bIdx}
                              className="text-sm text-neutral-60 leading-relaxed"
                            >
                              {b.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education?.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <RiBook2Line className="text-primary" /> Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.education.map((edu: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-border bg-light-gray/20"
                    >
                      <h4 className="font-bold text-neutral-100">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-primary font-medium">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-neutral-60 mt-1">
                        {edu.startDate} — {edu.endDate}
                      </p>
                      {edu.details && (
                        <p className="text-sm text-neutral-60 mt-2 italic">
                          "{edu.details}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {profile.projects?.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <RiLightbulbLine className="text-primary" /> Projects
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {profile.projects.map((proj: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-neutral-100 group-hover:text-primary transition-colors">
                          {proj.name}
                        </h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-60 hover:text-primary"
                          >
                            <RiExternalLinkLine size={16} />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-neutral-60 mt-1">
                        {proj.description}
                      </p>
                      {proj.tech?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {proj.tech.map((t: string) => (
                            <span
                              key={t}
                              className="text-[10px] uppercase tracking-wider font-bold text-neutral-40 bg-neutral-100 px-1.5 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assessment Answers */}
            {answers.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <RiCheckLine className="text-accent-green" /> Assessment
                  Answers
                </h3>
                <div className="space-y-6">
                  {answers.map((ans: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-sm font-medium text-neutral-100">
                        {idx + 1}. {ans.questionText}
                      </p>
                      <div className="p-3 bg-light-gray/30 rounded-lg border border-border">
                        <p className="text-sm text-neutral-80">{ans.answer}</p>
                      </div>
                      {ans.isCorrect !== undefined && (
                        <p
                          className={`text-xs font-semibold flex items-center gap-1 ${ans.isCorrect ? "text-accent-green" : "text-accent-red"}`}
                        >
                          {ans.isCorrect ? <RiCheckLine /> : <RiCloseLine />}
                          {ans.isCorrect
                            ? "Correct Answer"
                            : `Incorrect. Correct: ${ans.correctAnswer}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Actions & Info */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-xl border border-border p-6 space-y-4 sticky top-6">
              <h3 className="text-sm font-bold text-neutral-100 border-b border-border pb-2 flex items-center gap-2">
                <RiToolsLine className="text-primary" /> Application Status
              </h3>
              <div className="py-2">
                <StatusBadge status={app.status} />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-neutral-60 uppercase tracking-wider mb-2 font-semibold">
                  Update Status
                </p>
                {ALLOWED_STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusUpdate(s.value)}
                    disabled={updating || app.status === s.value}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg border transition-all flex items-center justify-between group ${
                      app.status === s.value
                        ? "bg-primary/5 border-primary text-primary font-semibold"
                        : "bg-white border-border text-neutral-80 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s.label}
                    {app.status === s.value && <RiCheckLine />}
                  </button>
                ))}
              </div>

              {/* Tags */}
              {app.tags?.length > 0 && (
                <div className="pt-4 mt-4 border-t border-border space-y-3">
                  <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                    <RiLightbulbLine className="text-primary" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-neutral-100 text-neutral-60 text-[10px] font-bold uppercase rounded border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              {app.company && (
                <div className="pt-4 mt-4 border-t border-border space-y-3">
                  <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                    <RiBuildingLine className="text-primary" /> Company Info
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-neutral-100">
                      {app.company.name}
                    </p>
                    {app.company.location && (
                      <p className="text-xs text-neutral-60 flex items-center gap-1">
                        <RiMapPinLine size={12} /> {app.company.location}
                      </p>
                    )}
                    {app.company.website && (
                      <a
                        href={app.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <RiGlobalLine size={12} /> Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Application History */}
              {app.history?.length > 0 && (
                <div className="pt-4 mt-4 border-t border-border space-y-3">
                  <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                    <RiHistoryLine className="text-primary" /> History
                  </h3>
                  <div className="space-y-4">
                    {app.history.map((h: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative pl-4 border-l border-border pb-1"
                      >
                        <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-neutral-300" />
                        <p className="text-xs font-bold text-neutral-80 capitalize">
                          {h.status.replace("_", " ")}
                        </p>
                        <p className="text-[10px] text-neutral-60">
                          {new Date(h.createdAt).toLocaleString()}
                        </p>
                        {h.changedBy && (
                          <p className="text-[10px] text-neutral-50">
                            By {h.changedBy.name} ({h.changedBy.role})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
