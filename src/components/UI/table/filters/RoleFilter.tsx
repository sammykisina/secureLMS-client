import React from "react";
import { Filter } from "@/components";

const RoleFilter = ({ column }: { column: any }) => {
  return <Filter column={column} label="Roles" />;
};

export default RoleFilter;
