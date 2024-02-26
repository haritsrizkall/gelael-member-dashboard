import Link from "next/link";
import { UrlObject } from "url";

export type ParentBreadcrumbProps = {
  name: string;
  link: string | UrlObject;
};

interface BreadcrumbProps {
  pageName: string;
  parent?: ParentBreadcrumbProps;
}
const Breadcrumb = ({ pageName, parent }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          {
            parent && (
              <li>
                <Link className="font-medium" href={parent.link}>
                  {parent.name} /
                </Link>
              </li>
            )
          }
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
