import Adw from "gi://Adw";
import Gtk from "gi://Gtk?version=4.0";

const notifications_page = workbench.builder.get_object<Adw.ViewStackPage>(
  "page3",
);
const notification_list = workbench.builder.get_object<Gtk.ListBox>(
  "notification_list",
);

const notification_count = 5;
notifications_page.badge_number = notification_count;

for (let i = 0; i < notification_count; i++) {
  const notification_row = new Adw.ActionRow({
    title: "Notification",
    selectable: false,
  });

  const button = new Gtk.Button({
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
    margin_top: 10,
    margin_bottom: 10,
    icon_name: "check-plain-symbolic",
  });

  button.connect("clicked", () => {
    notifications_page.badge_number -= 1;
    notification_list.remove(notification_row);

    if (notifications_page.badge_number === 0) {
      notifications_page.needs_attention = false;
    }
  });

  notification_row.add_suffix(button);

  notification_list.append(notification_row);
}
