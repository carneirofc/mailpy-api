import * as shell from "shelljs";

shell.mkdir("-p", "build/public");
shell.cp("-R", "public", "build");
