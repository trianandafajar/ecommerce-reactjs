import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        {pageTitle}
      </h2>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-500 transition-colors hover:text-[#00A9AA] dark:text-slate-400 dark:hover:text-[#00A9AA]"
            >
              Home
              <ChevronRight className="h-4 w-4" />
            </Link>
          </li>

          <li className="font-medium text-gray-800 dark:text-white">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
