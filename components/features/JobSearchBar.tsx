"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Text, textVariants } from "@/components/ui/Text"; // Your Text component
import { Button } from "@/components/ui/Button";

export default function JobSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const locations = [
    "Florence, Italy",
    "Rome, Italy",
    "Milan, Italy",
    "Venice, Italy",
    "Naples, Italy",
    "Paris, France",
    "Berlin, Germany",
  ];

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(query.toLowerCase()),
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className="flex flex-col gap-4 z-100">
      <div className="flex items-center p-4 bg-white max-w-[857px]">
        {/* Job title */}
        <div className="flex items-center flex-auto gap-4 px-4 h-[57px]">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11.7666"
                cy="11.7664"
                r="8.98856"
                stroke="#25324B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.0183 18.4849L21.5423 21.9997"
                stroke="#25324B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            placeholder="Job title or keyword"
            type="text"
            className={cn(
              textVariants({
                variant: "body_sm",
              }),
              "outline-none flex-auto border-b border-border h-full flex items-center",
            )}
          />
        </div>

        {/* Location - Searchable Select */}
        <div className="flex items-center flex-auto gap-4 px-4 h-[57px] relative">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.5 10.5005C14.5 9.11924 13.3808 8 12.0005 8C10.6192 8 9.5 9.11924 9.5 10.5005C9.5 11.8808 10.6192 13 12.0005 13C13.3808 13 14.5 11.8808 14.5 10.5005Z"
                stroke="#25324B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9995 21C10.801 21 4.5 15.8984 4.5 10.5633C4.5 6.38664 7.8571 3 11.9995 3C16.1419 3 19.5 6.38664 19.5 10.5633C19.5 15.8984 13.198 21 11.9995 21Z"
                stroke="#25324B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="flex h-full w-full items-center border-b border-border relative">
            <input
              placeholder="Florence, Italy"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className={cn(
                textVariants({
                  variant: "body_sm",
                }),
                "outline-none h-full flex-auto",
              )}
            />
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M12.6666 5.6665L7.99992 10.3332L3.33325 5.6665"
                  stroke="#7C8493"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            {/* Dropdown */}
            {open && filteredLocations.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-md shadow-lg z-50">
                {filteredLocations.map((loc) => (
                  <div
                    key={loc}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuery(loc);
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search button */}
        <Button className="h-[57px]">Search my job</Button>
      </div>
      <Text variant="body_sm" className="text-black">
        Popular :{" "}
        <span className="font-medium">
          UI Designer, UX Researcher, Android, Admin
        </span>
      </Text>
    </div>
  );
}
