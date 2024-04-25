import React from "react";
import Link from "next/link";

const NextLink = ({
  href,
  children,
  ...rest
}: {
  href: string;
  children: any;
}) => {
  return (
    <Link
      href={href}
      {...rest}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {children}
    </Link>
  );
};

export default NextLink;
