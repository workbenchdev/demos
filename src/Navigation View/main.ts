import Adw from "gi://Adw";
import Gtk from "gi://Gtk?version=4.0";

const nav_view = workbench.builder.get_object<Adw.NavigationView>("nav_view");
const nav_pageone = workbench.builder.get_object<Adw.NavigationPage>(
  "nav_pageone",
);
const next_button = workbench.builder.get_object<Gtk.Button>("next_button");
const previous_button = workbench.builder.get_object<Gtk.Button>(
  "previous_button",
);
const nav_pagetwo = workbench.builder.get_object<Adw.NavigationPage>(
  "nav_pagetwo",
);
const nav_pagethree = workbench.builder.get_object<Adw.NavigationPage>(
  "nav_pagethree",
);
const nav_pagefour = workbench.builder.get_object<Adw.NavigationPage>(
  "nav_pagefour",
);
const title = workbench.builder.get_object<Gtk.Label>("title");

next_button.connect("clicked", () => {
  switch (nav_view.visible_page) {
    case nav_pageone:
      nav_view.push(nav_pagetwo);
      break;
    case nav_pagetwo:
      nav_view.push(nav_pagethree);
      break;
    case nav_pagethree:
      nav_view.push(nav_pagefour);
      break;
  }
});

previous_button.connect("clicked", () => {
  nav_view.pop();
});

nav_view.connect("notify::visible-page", () => {
  previous_button.sensitive = nav_view.visible_page !== nav_pageone;
  next_button.sensitive = nav_view.visible_page !== nav_pagefour;
  title.label = nav_view.visible_page.title;
});
