"use client";

import AdminTopbar from "@/components/admin/Topbar";
import { StatCard, HeroStatCard } from "@/components/admin/StatCard";
import { JobTypeBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { useJobTypesQuery } from "@/lib/hooks/job-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  RiBriefcaseLine,
  RiFileList3Line,
  RiBuilding2Line,
  RiUserLine,
  RiArrowRightLine,
} from "react-icons/ri";
import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { getAdminJobs } from "@/lib/services/jobs";
import { useQuery } from "@tanstack/react-query";

// Mock stat chart data (replace with real API when analytics endpoint is added)
const WEEKLY_DATA = [
  { day: "Mon", views: 120, applied: 34 },
  { day: "Tue", views: 180, applied: 52 },
  { day: "Wed", views: 220, applied: 80 },
  { day: "Thu", views: 160, applied: 44 },
  { day: "Fri", views: 90, applied: 25 },
  { day: "Sat", views: 60, applied: 15 },
  { day: "Sun", views: 50, applied: 10 },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: getAdminJobs,
    enabled: !!session,
  });

  const stats = useMemo(() => {
    if (!jobs) {
      return {
        totalJobs: 0,
        publishedJobs: 0,
        totalApplications: 0,
        recentJobs: [],
      };
    }
    return {
      totalJobs: jobs.length,
      publishedJobs: jobs.filter((j) => j.isPublished).length,
      totalApplications: 0,
      recentJobs: jobs.slice(0, 5),
    };
  }, [jobs]);

  const jobTypesQuery = useJobTypesQuery();
  const jobTypeMap = useMemo(() => {
    return Object.fromEntries(
      (jobTypesQuery.data ?? []).map((t) => [t._id, t.name]),
    );
  }, [jobTypesQuery.data]);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="QuickHire Admin — Overview" />
      <main className="flex-1 p-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-bold text-neutral-100 font-clash">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-sm text-neutral-60 mt-0.5">
            Here&apos;s what&apos;s happening with your job board today.
          </p>
        </div>

        {/* Hero stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <HeroStatCard
            value={isLoading ? "…" : stats.totalJobs}
            label="Total Jobs"
            bg="bg-primary"
          />
          <HeroStatCard
            value={isLoading ? "…" : stats.publishedJobs}
            label="Published Jobs"
            bg="bg-gradient-to-br from-accent-green to-[#3bab8a]"
          />
          <HeroStatCard
            value={isLoading ? "…" : stats.totalJobs - stats.publishedJobs}
            label="Draft Jobs"
            bg="bg-gradient-to-br from-accent-yellow to-[#e09d25]"
          />
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs"
            value={isLoading ? "–" : stats.totalJobs}
            icon={<RiBriefcaseLine className="text-primary text-xl" />}
            iconBg="bg-primary/10"
          />
          <StatCard
            title="Published"
            value={isLoading ? "–" : stats.publishedJobs}
            change="Active listings"
            changeType="up"
            icon={<RiFileList3Line className="text-accent-green text-xl" />}
            iconBg="bg-accent-green/10"
          />
          <StatCard
            title="Drafts"
            value={isLoading ? "–" : stats.totalJobs - stats.publishedJobs}
            icon={<RiBuilding2Line className="text-accent-yellow text-xl" />}
            iconBg="bg-accent-yellow/10"
          />
          <StatCard
            title="Applications"
            value={"Coming soon"}
            icon={<RiUserLine className="text-accent-blue text-xl" />}
            iconBg="bg-accent-blue/10"
          />
        </div>

        {/* Chart + Recent jobs */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Chart */}
          <div className="xl:col-span-3 bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-100">
                  Job Statistics
                </h3>
                <p className="text-xs text-neutral-60">
                  Weekly views vs applications
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-neutral-60">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-accent-yellow inline-block" />{" "}
                  Views
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-primary inline-block" />{" "}
                  Applied
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WEEKLY_DATA} barSize={14} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#D6DDEB"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#7C8493" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#7C8493" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #D6DDEB",
                    fontSize: 12,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend wrapperStyle={{ display: "none" }} />
                <Bar dataKey="views" fill="#FFB836" radius={[4, 4, 0, 0]} />
                <Bar dataKey="applied" fill="#4640DE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent jobs */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-100">
                Recent Jobs
              </h3>
              <Link
                href="/admin/jobs"
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                View all <RiArrowRightLine />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse h-12 bg-light-gray rounded-lg"
                  />
                ))}
              </div>
            ) : stats.recentJobs.length === 0 ? (
              <p className="text-sm text-neutral-60 text-center py-8">
                No jobs yet
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentJobs.map((job) => (
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    key={job.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-light-gray transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-100 truncate group-hover:text-primary transition-colors">
                        {job.title}
                      </p>
                      <p className="text-xs text-neutral-60 mt-0.5">
                        {job.updatedAt
                          ? new Date(job.updatedAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <JobTypeBadge
                        type={jobTypeMap[job.job_type] || job.job_type}
                      />
                      <StatusBadge
                        status={job.isPublished ? "published" : "unpublished"}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-bold text-neutral-100 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#3730c4] transition-colors shadow-sm"
            >
              <RiBriefcaseLine /> Post a Job
            </Link>
            <Link
              href="/admin/companies"
              className="inline-flex items-center gap-2 border border-border text-neutral-80 text-sm font-semibold px-4 py-2.5 rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              <RiBuilding2Line /> Add Company
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 border border-border text-neutral-80 text-sm font-semibold px-4 py-2.5 rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              <RiFileList3Line /> Manage Categories
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
