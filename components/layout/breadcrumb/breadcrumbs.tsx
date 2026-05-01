'use client';

import { Icon } from "@iconify/react";
import { Link } from "@heroui/react";

interface BreadCrumbProps {
  title: string;
  breadcrumbs: Array<{ name: string; path: string }>;
}

const Breadcrumb = ({ title, breadcrumbs }: BreadCrumbProps) => {
  return (
    <div>
      <nav className="flex mb-2" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-medium text-default-400 hover:text-default-600 transition-colors"
            >
              <Icon icon="tabler:home-filled" fontSize={14} />
            </Link>
          </li>

          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index}>
              <div className="flex items-center">
                <Icon
                  icon="solar:alt-arrow-right-broken"
                  fontSize={16}
                  className="text-default-300"
                />
                <Link
                  href={breadcrumb.path}
                  className="ms-1 text-xs font-medium text-default-400 hover:text-default-700 md:ms-2 transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <h2 className="text-2xl font-semibold tracking-tight text-default-900 mt-1 mb-1">
        {title}
      </h2>
      <div className="w-8 h-0.5 rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 mt-1 mb-4" />
    </div>
  );
};

export default Breadcrumb;
