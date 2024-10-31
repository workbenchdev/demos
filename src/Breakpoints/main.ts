import Adw from "gi://Adw";

const breakpoint = workbench.builder.get_object<Adw.Breakpoint>("breakpoint");

breakpoint.connect("apply", () => {
  console.log("Breakpoint Applied");
});

breakpoint.connect("unapply", () => {
  console.log("Breakpoint Unapplied");
});
